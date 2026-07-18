# Noor Design System — Firebase Realtime Database Specification
## Hazrat Aisha Academy, Sitamarhi, Bihar

This specification provides the exhaustive, production-grade JSON tree structure for the Hazrat Aisha Academy serverless database. It maps directly to our Firebase security rules and explains all child nodes, data types, validation keys, and design principles.

---

## 1. Structural Overview

The Hazrat Aisha Academy platform utilizes the **Firebase Realtime Database** in a flat, denormalized, and indexed configuration to enable:
* Real-time sync for Parent-Teacher-Principal portals
* Fast indexing and query performance over low-bandwidth mobile connections in Bihar
* WCAG 2.2 Level AA-compliant instant page updates and data reactivity

### Root JSON Tree Layout
```json
{
  "users": {},
  "students": {},
  "teachers": {},
  "classes": {},
  "attendance": {},
  "results": {},
  "fees": {},
  "notices": {},
  "gallery": {},
  "settings": {}
}
```

---

## 2. Exhaustive Node Specification

### A. Users Node (`/users`)
Maps verified Firebase Authentication User IDs (`uid`) to platform profiles and roles.
* **Security**: Read/Write restricted to owner matching `auth.uid`.

```json
{
  "users": {
    "user_uid_101": {
      "email": "principal@haa.edu.in",
      "displayName": "Principal Fatima",
      "role": "principal",
      "photoUrl": "https://firebasestorage.googleapis.com/v0/b/haa-81a96.appspot.com/o/avatars%2Fprincipal.jpg?alt=media",
      "createdAt": 1781520000000,
      "updatedAt": 1781521000000
    }
  }
}
```

| Field Name | Data Type | Description / Valid Values |
| :--- | :--- | :--- |
| `email` | String | Verified academic email address |
| `displayName` | String | Full name of the user for headers and UI cards |
| `role` | String | User role: `"admin" \| "principal" \| "teacher" \| "parent" \| "student"` |
| `photoUrl` | String | Storage link to profile picture asset (Refer to image-generation skill) |
| `createdAt` | Number | Unix epoch millisecond timestamp |
| `updatedAt` | Number | Last modification epoch millisecond timestamp |

---

### B. Students Node (`/students`)
Houses comprehensive student rosters and parent-association records.
* **Security**: Read-accessible to all authenticated users; Write restricted to Admin or Principal roles.

```json
{
  "students": {
    "student_id_456": {
      "admissionNumber": "HAA-2026-0089",
      "name": "Zainab Fatima",
      "class": "Class V",
      "section": "A",
      "dob": "2016-04-12",
      "gender": "Female",
      "parentName": "Abdur Rahman",
      "contact": "+919876543210",
      "address": "Chak Rajopatti, Sitamarhi, Bihar, 843302",
      "photoUrl": "https://firebasestorage.googleapis.com/v0/b/haa-81a96.appspot.com/o/students%2Fzainab.jpg?alt=media",
      "status": "active",
      "joiningDate": "2026-04-01",
      "createdAt": 1781520000000
    }
  }
}
```

| Field Name | Data Type | Description / Valid Values |
| :--- | :--- | :--- |
| `admissionNumber` | String | Official format `HAA-[Year]-[4-Digit-ID]` |
| `name` | String | Student's full official name |
| `class` | String | Current academic standard (e.g., `"Class V"`) |
| `section` | String | Standard section (e.g., `"A"`, `"B"`) |
| `dob` | String | Date of Birth in ISO 8601 `"YYYY-MM-DD"` format |
| `parentName` | String | Full name of father/mother or legal guardian |
| `contact` | String | 10-digit mobile number with international country prefix |
| `status` | String | Academic status: `"active" \| "inactive" \| "graduated"` |

---

### C. Teachers Node (`/teachers`)
Maintains details of teachers, assigned curriculum streams, and subject lists.
* **Security**: Read-accessible to authenticated users; Write restricted to Admin/Principal roles.

```json
{
  "teachers": {
    "teacher_id_789": {
      "employeeId": "HAA-TCH-012",
      "name": "Amina Khatoon",
      "email": "amina.k@haa.edu.in",
      "contact": "+919876543211",
      "role": "teacher",
      "department": "Islamic Studies",
      "qualification": "M.A. Islamic Studies, B.Ed",
      "joiningDate": "2024-06-15",
      "status": "active",
      "classesAssigned": {
        "class_v_a": true,
        "class_vi_b": true
      },
      "subjects": [
        "Quranic Studies",
        "Hadith",
        "Arabic Language"
      ]
    }
  }
}
```

| Field Name | Data Type | Description / Valid Values |
| :--- | :--- | :--- |
| `employeeId` | String | Unique staff registration ID `HAA-TCH-[3-Digit-ID]` |
| `department` | String | Faculty category: `"Islamic Studies" \| "Mathematics" \| "Science" \| "English"` |
| `classesAssigned` | Map | Boolean flags mapping assigned standard keys |
| `subjects` | Array | Specialized list of subjects instructed by the teacher |

---

### D. Classes Node (`/classes`)
Structures class timetables, subject distributions, and class teacher mappings.
* **Security**: Read-accessible to all authenticated users; Write restricted to Admin/Principal.

```json
{
  "classes": {
    "class_v_a": {
      "className": "Class V",
      "section": "A",
      "classTeacherId": "teacher_id_789",
      "roomNumber": "Room 102",
      "studentCount": 35,
      "subjects": {
        "subject_math": {
          "name": "Mathematics",
          "teacherId": "teacher_id_math_01"
        },
        "subject_islamic": {
          "name": "Quranic Studies",
          "teacherId": "teacher_id_789"
        }
      }
    }
  }
}
```

---

### E. Attendance Node (`/attendance`)
Maintains daily registers for both students and staff.
* **Security**: Read-accessible to authenticated users; Write restricted to teachers (for students) and Admin (for teachers).

```json
{
  "attendance": {
    "2026-07-16": {
      "students": {
        "student_id_456": {
          "status": "present",
          "markedBy": "teacher_id_789",
          "timestamp": 1781520000000,
          "notes": ""
        }
      },
      "teachers": {
        "teacher_id_789": {
          "status": "present",
          "markedBy": "admin_uid_101",
          "timestamp": 1781516400000,
          "notes": "Punctual entry logged"
        }
      }
    }
  }
}
```

| Field Name | Data Type | Description / Valid Values |
| :--- | :--- | :--- |
| `status` | String | Daily attendance status: `"present" \| "absent" \| "late" \| "excused"` |
| `markedBy` | String | User UID of the teacher or administrator logging the state |

---

### F. Results Node (`/results`)
Maintains grade matrices and term-wise student report cards.
* **Security**: Read-accessible to authenticated users; Write restricted to Admin and teachers.

```json
{
  "results": {
    "exam_term_1_2026": {
      "examName": "Term I Examination",
      "academicYear": "2026-2027",
      "published": true,
      "publishedAt": 1781520000000,
      "marks": {
        "student_id_456": {
          "subject_math": {
            "theory": 72,
            "practical": 18,
            "total": 90,
            "grade": "A+",
            "remarks": "Excellent numerical logic"
          },
          "subject_islamic": {
            "theory": 80,
            "practical": 20,
            "total": 100,
            "grade": "O",
            "remarks": "Perfect recitation and understanding of Quranic verses"
          }
        }
      },
      "gpa": {
        "student_id_456": 9.5
      }
    }
  }
}
```

---

### G. Fees Node (`/fees`)
Stores billing plans, invoices, and transaction records for portal audits.
* **Security**: Read/Write strictly restricted to Admin and Principal roles to guarantee fiscal safety.

```json
{
  "fees": {
    "invoice_id_889": {
      "studentId": "student_id_456",
      "studentName": "Zainab Fatima",
      "class": "Class V",
      "billPeriod": "July 2026",
      "dueDate": "2026-07-10",
      "amountDue": 1200.00,
      "amountPaid": 1200.00,
      "status": "paid",
      "transactions": {
        "txn_id_9901": {
          "amount": 1200.00,
          "paymentMethod": "UPI",
          "referenceNumber": "619712971221",
          "timestamp": 1781001600000,
          "receivedBy": "admin_uid_101"
        }
      }
    }
  }
}
```

| Field Name | Data Type | Description / Valid Values |
| :--- | :--- | :--- |
| `billPeriod` | String | Targeted billing month (e.g., `"July 2026"`) |
| `amountDue` | Number | Charged amount in Indian Rupees (INR) |
| `status` | String | Transaction status: `"paid" \| "partial" \| "unpaid" \| "overdue"` |
| `paymentMethod` | String | Mode of receipt: `"UPI" \| "Cash" \| "Bank Transfer" \| "Check"` |

---

### H. Notices Node (`/notices`)
Tracks announcements published on the main dashboard notice board.
* **Security**: Read-accessible publicly (`"true"`); Write restricted to Admin or Principal roles.

```json
{
  "notices": {
    "notice_id_001": {
      "title": "Admissions Open for Academic Session 2026-2027",
      "content": "Hazrat Aisha Academy is pleased to announce that registrations are active for the upcoming academic year. Form submission terminals are fully online.",
      "category": "admission",
      "publishedBy": "principal_uid_101",
      "publishedAt": 1781520000000,
      "attachmentUrl": "https://firebasestorage.googleapis.com/.../brochure.pdf",
      "isPinned": true
    }
  }
}
```

| Field Name | Data Type | Description / Valid Values |
| :--- | :--- | :--- |
| `category` | String | Announcement type: `"academic" \| "admission" \| "event" \| "holiday"` |
| `isPinned` | Boolean | Highlights notice at the absolute top of the user dashboard notice slider |

---

### I. Gallery Node (`/gallery`)
Stores albums, images, and descriptions of activities for local communities.
* **Security**: Read-accessible publicly (`"true"`); Write restricted to Admin/Principal.

```json
{
  "gallery": {
    "album_id_001": {
      "title": "Annual Day Celebration 2026",
      "description": "Visual highlights showing our students' presentations on moral excellence.",
      "coverPhotoUrl": "https://firebasestorage.googleapis.com/v0/b/haa-81a96.appspot.com/o/gallery%2Fcover.jpg?alt=media",
      "createdAt": 1781520000000,
      "media": {
        "photo_id_1": {
          "type": "image",
          "url": "https://firebasestorage.googleapis.com/v0/b/haa-81a96.appspot.com/o/gallery%2Fphoto1.jpg?alt=media",
          "caption": "Primary grade recitations on Hazrat Aisha (R.A) qualities"
        }
      }
    }
  }
}
```

---

### J. Settings Node (`/settings`)
Holds academic metadata parameters, grading definitions, and institutional parameters.
* **Security**: Read-accessible publicly; Write restricted to Admin.

```json
{
  "settings": {
    "school": {
      "name": "Hazrat Aisha Academy",
      "address": "Chak Rajopatti, Sitamarhi, Bihar, 843302",
      "contactEmail": "info@haa.edu.in",
      "contactPhone": "+919876543210",
      "academicYear": "2026-2027"
    },
    "security": {
      "lockoutAttempts": 5,
      "sessionTimeoutMinutes": 30,
      "allowedRoles": [
        "admin",
        "principal",
        "teacher",
        "parent",
        "student"
      ]
    }
  }
}
```

---

## 3. Database Integrity & Design Rules

To prevent slop and ensure seamless real-time syncing over Edge/3G cellular links in Sitamarhi, developers must follow these standard guidelines:
1. **Never Nest Logs or Arrays**: Structure sub-collections under independent root IDs (e.g. results are grouped by Exam IDs under `/results` rather than stored nested directly inside student objects).
2. **Use Epoch Timestamps**: Timestamps must always be numeric Unix millisecond integers (`Date.now()`) to allow clean sorting queries.
3. **Double-Write Safety Guards**: Keep transaction processes clean by checking for positive values before committing numerical credits or debit changes.
