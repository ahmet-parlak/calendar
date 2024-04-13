exports.convertGoogleCalendarEvents = (data) => {
  const googleCalendarEvents = data?.data.items ?? [];
  const events = [];
  googleCalendarEvents.forEach((googleCalendarEvent) => {
    const event = {
      id: googleCalendarEvent?.id ?? '',
      title: googleCalendarEvent?.summary ?? '',
      description: googleCalendarEvent?.description ?? '',
      start:
        googleCalendarEvent?.start?.dateTime ??
        googleCalendarEvent?.start?.date ??
        '',
      end:
        googleCalendarEvent?.end?.dateTime ??
        googleCalendarEvent?.end?.date ??
        '',
    };

    events.push(event);
  });

  return events;
};
