const fs = require('fs');

const rules = {
  "rules": {
    "attendance": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "staff": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "students": {
      // Allow public read only for specific queries used by the Result Portal
      ".read": "auth != null || query.orderByChild == 'class' || query.orderByChild == 'rollNumber' || query.orderByChild == 'admissionNumber'",
      ".write": "auth != null",
      ".indexOn": ["admissionNumber", "rollNumber", "class", "firstName", "lastName"]
    },
    "exams": {
      "list": {
        // Result Portal needs to read the list of exams
        ".read": "auth != null || true", 
        ".write": "auth != null"
      },
      "marks": {
        // Result Portal needs to fetch marks for specific exams
        ".read": "auth != null || true",
        ".write": "auth != null"
      },
      "published": {
        ".read": "auth != null || true",
        ".write": "auth != null"
      }
    },
    "users": {
      "$uid": {
        ".read": "auth != null",
        ".write": "auth != null && auth.uid === $uid"
      }
    },
    "settings": {
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "system_logs": {
      ".indexOn": ["timestamp"],
      ".read": "auth != null",
      ".write": "auth != null"
    },
    "backups": {
      ".indexOn": ["timestamp"],
      ".read": "auth != null",
      ".write": "auth != null"
    }
  }
};

fs.writeFileSync('database.rules.json', JSON.stringify(rules, null, 2));
console.log("Rules written.");
