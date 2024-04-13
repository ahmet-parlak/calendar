var createEventModal = new bootstrap.Modal(
  document.getElementById('createEventModal')
);
var calendar = null;

document.addEventListener('DOMContentLoaded', function () {
  /**
   *  Create Calendar
   */
  let events = [];
  const calendarEl = document.getElementById('calendar');
  calendar = new FullCalendar.Calendar(calendarEl, {
    themeSystem: 'bootstrap5',
    locale: 'tr',
    editable: false,
    selectable: true,
    buttonIcons: false,
    events: events,
    select: function (info) {
      const eventStartInput = document.querySelector('#createEventStart');
      const eventEndInput = document.querySelector('#createEventEnd');
      eventStartInput.value = info.startStr;
      eventEndInput.value = info.endStr;
      createEventModal.show();
    },
    eventClick: function (info) {
      const event = {
        id: info.event.id,
        title: info.event.title,
        description: info.event.extendedProps.description,
        start: info.event.startStr,
        end: info.event.endStr,
      };
      showEvent(event);
    },
  });

  calendar.render();

  //Fetch events
  fetchEvents();

  document.querySelector('#createEventForm').onsubmit = createEvent;
});

// ----------------------------------------------
// Fetch Events
// ----------------------------------------------
function fetchEvents() {
  const url = '/calendar/events';
  showLoading({
    title: 'Please Wait',
    text: 'Google Calendar Events is loading...',
  });
  fetch(url, {
    method: 'GET',
  })
    .then((response) => response.json())
    .then((response) => {
      if (response.status == 302 && response?.redirect_url) {
        window.location.href = response.redirect_url;
        return;
      }

      if (response.status == 'success') {
        events = response?.events ?? [];
        calendar.addEventSource(events);
      } else {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: response?.message ?? 'Failed to fetch Google Calendar events',
          confirmButtonColor: '#191c24',
        });
      }
    })
    .catch((error) => {
      console.error('An error occured:', error);
    })
    .finally(hideLoading);
}

// ----------------------------------------------
// Create Event
// ----------------------------------------------
function createEvent(e) {
  e.preventDefault();

  const title = document.querySelector('#createEventTitle').value;
  const start = document.querySelector('#createEventStart').value;
  const end = document.querySelector('#createEventEnd').value;
  const description = document.querySelector('#createEventDescription').value;

  //Form Validation
  if (!(title.length > 0) || !(start.length > 0) || !(end.length > 0)) return;

  createEventForm.querySelector('[type="submit"]').classList.add('disabled');

  const url = '/calendar/events';

  const postData = {
    title: title,
    start: start,
    end: end,
    description: description,
  };

  showLoading({
    title: 'Please Wait',
    text: 'Event creating',
  });
  fetch(url, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
    },
    body: JSON.stringify(postData),
  })
    .then((response) => {
      hideLoading();
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      return response.json();
    })
    .then((data) => {
      if (data.status == 'success') {
        calendar.addEvent(data?.event ?? postData);
        createEventModal.hide();
        Swal.fire({
          position: 'center',
          icon: 'success',
          title: 'Event created!',
          showConfirmButton: false,
          timer: 1500,
        });
        document.querySelector('#createEventTitle').value = '';
        document.querySelector('#createEventDescription').value = '';
        document.querySelector('#createEventStart').value = '';
        document.querySelector('#createEventEnd').value = '';
      }
    })
    .catch((error) => {
      console.error('An error occured:', error);
      Swal.fire({
        position: 'center',
        icon: 'error',
        title: 'An error occured',
        text: error ?? '',
      });
    })
    .finally(() => {
      createEventForm
        .querySelector('[type="submit"]')
        .classList.remove('disabled');
    });
}

// ----------------------------------------------
// Show Event
// ----------------------------------------------
function showEvent(event) {
  var showEventModal = new bootstrap.Modal(
    document.getElementById('showEventModal')
  );

  const titleInput = document.querySelector('#editEventTitle');
  const startInput = document.querySelector('#editEventStart');
  const endInput = document.querySelector('#editEventEnd');
  const descriptionInput = document.querySelector('#editEventDescription');

  titleInput.value = event.title ?? '';
  startInput.value = event.start ?? '';
  endInput.value = event.end ?? '';
  descriptionInput.value = event.description ?? '';

  showEventModal.show();

  const showEventForm = document.querySelector('#editEventForm');
  const deleteEventBtn = document.querySelector('#deleteEventBtn');

  showEventForm.onsubmit = function (e) {
    e.preventDefault();

    const id = event.id;
    const title = titleInput.value;
    const start = startInput.value;
    const end = endInput.value;
    const description = descriptionInput.value;

    //Form Validation
    if (!(title.length > 0) || !(start.length > 0) || !(end.length > 0)) return;

    showEventForm.querySelector('[type="submit"]').classList.add('disabled');

    const url = `/calendar/events/${id}?_method=PATCH`;

    const postData = {
      id: id,
      title: title,
      start: start,
      end: end,
      description: description,
    };

    showLoading({
      title: 'Please Wait',
      text: 'Event updating',
    });
    fetch(url, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify(postData),
    })
      .then((response) => {
        hideLoading();
        return response.json();
      })
      .then((data) => {
        if (data.status == 'success') {
          calendar.getEventById(id).remove();
          calendar.addEvent(data?.event ?? postData);

          showEventModal.hide();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Event updated!',
            showConfirmButton: false,
            timer: 1500,
          });
        } else if (data.status == 'error') {
          let errors = '';

          data?.error_messages.forEach((error) => {
            errors += `<li>${error}</li>`;
          });

          Swal.fire({
            position: 'center',
            icon: 'warning',
            title: 'Error',
            html: errors,
          });
        } else {
          throw new Error('An error occured');
        }
      })
      .catch((error) => {
        Swal.fire({
          position: 'center',
          icon: 'error',
          title: 'An error occured',
          html: errors,
          showConfirmButton: false,
          timer: 1500,
        });
      })
      .finally(() => {
        showEventForm
          .querySelector('[type="submit"]')
          .classList.remove('disabled');
      });
  };

  /**
   * Delete Event
   */
  deleteEventBtn.addEventListener('click', () => {
    deleteEventBtn.classList.add('disabled');
    Swal.fire({
      title: 'Are you sure?',
      text: 'Event will be deleted!',
      showCancelButton: true,
      confirmButtonText: 'Delete',
      confirmButtonColor: '#d33',
    }).then((result) => {
      deleteEventBtn.classList.remove('disabled');

      if (!result.isConfirmed) return;

      const id = event.id;
      const url = `/calendar/events/${id}?_method=DELETE`;

      const postData = {};

      showLoading({
        title: 'Please Wait',
        text: 'Event deleting',
      });
      fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(postData),
      })
        .then((response) => {
          hideLoading();
          if (!response.ok) {
            Swal.fire({
              position: 'center',
              icon: 'error',
              title: 'Event could not be deleted!',
              showConfirmButton: false,
              timer: 1500,
            });
            return;
          }
          calendar.getEventById(id).remove();
          showEventModal.hide();
          Swal.fire({
            position: 'center',
            icon: 'success',
            title: 'Event deleted!',
            showConfirmButton: false,
            timer: 1500,
          });
        })
        .catch((error) => {
          console.error('An error occured:', error);
          Swal.fire({
            position: 'center',
            icon: 'error',
            title: 'An error occured!',
            showConfirmButton: false,
            timer: 1500,
          });
        });
    });
  });
}

// ----------------------------------------------
// Loading Alert
// ----------------------------------------------
function showLoading(options = {}) {
  const defaultOptions = {
    title: 'Loading...',
    text: 'Please wait',
  };

  const mergedOptions = {
    ...defaultOptions,
    ...options,
  };

  Swal.fire({
    title: mergedOptions.title,
    text: mergedOptions.text,
    allowOutsideClick: false,
    showConfirmButton: false,
    didOpen: () => {
      Swal.showLoading();
    },
  });
}

function hideLoading() {
  Swal.close();
}
