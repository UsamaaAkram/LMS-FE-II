# Bluverse LMS-II — Frontend

React 19 + TypeScript + Vite + Redux Toolkit. Scoped LMS UI (auth, student, admin, courses).

## Setup
```bash
npm install
cp .env.example .env   # VITE_API_URL=http://localhost:5000
npm run dev            # http://localhost:3000
```
Run the backend (`LMS-BE-II`) first.

## Flow
- `/` → redirects to **/login**. No public marketing pages.
- **Student** (after admin approval): Courses (enrolled list → details → watch) + Settings.
- **Admin**: Courses (create/edit/list/delete) + Students (list, enable/disable, assign courses) + Settings.
- New students sign up → land **disabled** → see the approval screen until an admin enables them.

## Auth
- JWT stored in the persisted `auth` slice; `main.tsx` syncs it into the axios `Authorization` header for every request.
- Route guards: `adminRoute` (admin), `studentRoute` (student + disable gate), `privateRoute` (shared course screens).

## Theme
- Palette (Double Split Complementary) + fonts (Poppins/Inter) in `src/style/scss/_theme-bluverse.scss`.
- Fonts loaded via `index.html`.

## Structure (in-scope only)
```
feature-module/
  auth/        login, register, forgot-password, reset-password, error-404
  Courses/     add-newCourse, edit-course, course-details, course-watch
  Instructor/  instructor-course (admin courses), student-list, student-details, approval-screen
  student/     student-course (enrolled), student-settings
  admin/       admin-settings
  router/      all_routes, router.link, router (admin/student/shared/auth)
core/redux/    auth, courses, student, studentCourses, sidebar, themeSetting
```
