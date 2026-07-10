STUDENT LOGIN SYSTEM
Navigation button: “STUDENT LOGIN”
Student logs in using credentials.

STUDENT DASHBOARD
Inside dashboard student can:

●	View purchased courses
●	Watch videos
●	Check course validity
●	Access course materials Additional space should exist for:
 
●	Promotional banners
●	Merchandise promotions
●	New course launches
●	Offers

# Student Dashboard - Data Structure & API Requirements

## 1. Student Authentication

### Login

Student can login using registered email/mobile and password.

### APIs

* POST /api/student/login
* POST /api/student/logout
* GET /api/student/profile

---

## 2. Student Profile

### Data Structure

```json
{
  "studentId": "",
  "name": "",
  "email": "",
  "mobile": "",
  "profileImage": ""
}
```

### APIs

* GET /api/student/profile
* PUT /api/student/profile

---

## 3. Purchased Courses

### Data Structure

```json
{
  "courseId": "",
  "courseTitle": "",
  "thumbnail": "",
  "purchaseDate": "",
  "validTill": "",
  "courseType": "Live | Recorded",
  "progress": 0
}
```

### APIs

* GET /api/student/courses
* GET /api/student/course/:courseId

---

## 4. Course Videos

### Data Structure

```json
{
  "videoId": "",
  "title": "",
  "videoUrl": "",
  "duration": "",
  "isCompleted": false
}
```

### APIs

* GET /api/student/course/:courseId/videos
* POST /api/student/video/progress

---

## 5. Course Validity

### Data Structure

```json
{
  "courseId": "",
  "validFrom": "",
  "validTill": "",
  "daysRemaining": 0
}
```

### API

* GET /api/student/course/:courseId/validity

---

## 6. Course Materials

### Data Structure

```json
{
  "materialId": "",
  "title": "",
  "fileType": "PDF",
  "fileUrl": ""
}
```

### APIs

* GET /api/student/course/:courseId/materials

---

## 7. Promotional Banners

### Data Structure

```json
{
  "bannerId": "",
  "title": "",
  "image": "",
  "redirectLink": ""
}
```

### API

* GET /api/student/banners

---

## 8. Merchandise Promotions

### Data Structure

```json
{
  "productId": "",
  "title": "",
  "image": "",
  "price": ""
}
```

### API

* GET /api/student/merchandise

---

## 9. New Course Launches

### Data Structure

```json
{
  "courseId": "",
  "title": "",
  "thumbnail": "",
  "launchDate": ""
}
```

### API

* GET /api/student/new-courses

---

## 10. Offers & Discounts

### Data Structure

```json
{
  "offerId": "",
  "title": "",
  "discount": "",
  "validTill": ""
}
```

### API

* GET /api/student/offers

---

## Dashboard Sections

1. My Courses
2. Watch Videos
3. Course Materials
4. Course Validity
5. Promotional Banners
6. Merchandise Promotions
7. New Course Launches
8. Offers & Discounts