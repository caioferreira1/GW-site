const EVENT_TYPE_ID = 5751687;
const TIMEZONE = 'America/New_York';

function parseStartISO(dateISO, timeStr) {
  const [timePart, ampm] = timeStr.trim().split(' ');
  let [h, m] = timePart.split(':').map(Number);
  if (ampm === 'PM' && h !== 12) h += 12;
  if (ampm === 'AM' && h === 12) h = 0;

  const nominalUTC = new Date(
    `${dateISO}T${String(h).padStart(2, '0')}:${String(m).padStart(2, '0')}:00Z`
  );

  const parts = new Intl.DateTimeFormat('en-US', {
    timeZone: TIMEZONE,
    hour: '2-digit',
    minute: '2-digit',
    hour12: false,
  }).formatToParts(nominalUTC);

  const tzH = parseInt(parts.find(p => p.type === 'hour').value);
  const tzM = parseInt(parts.find(p => p.type === 'minute').value);

  let offsetMs = ((h * 60 + m) - (tzH * 60 + tzM)) * 60000;
  if (offsetMs > 43200000) offsetMs -= 86400000;
  if (offsetMs < -43200000) offsetMs += 86400000;

  return new Date(nominalUTC.getTime() + offsetMs).toISOString();
}

module.exports = async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' });
  }

  const { name, email, phone, website, date, time } = req.body || {};

  if (!name || !email || !date || !time) {
    return res.status(400).json({ error: 'Missing required fields.' });
  }

  const apiKey = process.env.CAL_API_KEY;
  if (!apiKey) {
    console.error('CAL_API_KEY environment variable is not set');
    return res.status(500).json({ error: 'Server misconfigured.' });
  }

  let startISO;
  try {
    startISO = parseStartISO(date, time);
  } catch (err) {
    return res.status(400).json({ error: 'Invalid date or time.' });
  }

  const notes = [
    website ? `Website: ${website}` : '',
    phone ? `Phone: ${phone}` : '',
  ]
    .filter(Boolean)
    .join('\n');

  const calRes = await fetch('https://api.cal.com/v2/bookings', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${apiKey}`,
      'Content-Type': 'application/json',
      'cal-api-version': '2024-06-11',
    },
    body: JSON.stringify({
      start: startISO,
      eventTypeId: EVENT_TYPE_ID,
      responses: {
        name,
        email,
        ...(notes ? { notes } : {}),
      },
      guests: ['mcorreabc@gmail.com'],
      timeZone: 'America/New_York',
      language: 'en',
      metadata: {},
    }),
  });

  const data = await calRes.json();

  if (!calRes.ok) {
    const msg =
      data?.error?.message ||
      data?.message ||
      'Booking failed — please try again.';
    console.error('Cal.com API error:', data);
    return res.status(calRes.status).json({ error: msg });
  }

  return res.status(200).json({ success: true });
}
