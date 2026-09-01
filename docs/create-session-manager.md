## Context

As an instructor, I need to be able to create a class session using the available timeslots

## Constrictions

- An instructor can only use existing timeslots when creatiing a class session
- Creating a session should automatically assign the instructor currently logged in.
- Admins will be the only ones with the ability to edit session data that isn't their own.

## Implementation

- Session use cases on API for CRUD operations
- "create-session" page component on client for frontend
    - should only be accessible to instructors and admins
- Be able to view list of sessions for current instructor
- weekly calender display with available timeslots shown.
    - using FullCalendar for weekly display.
- any timeslots with contained classes should be greyed out and inoperable
- instructor should be able to click on a timeslot and open a form to create a session.
