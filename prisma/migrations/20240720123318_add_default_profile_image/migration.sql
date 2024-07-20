-- RedefineTables
PRAGMA defer_foreign_keys=ON;
PRAGMA foreign_keys=OFF;
CREATE TABLE "new_users" (
    "id" INTEGER NOT NULL PRIMARY KEY AUTOINCREMENT,
    "email" TEXT NOT NULL,
    "login" TEXT NOT NULL,
    "password" TEXT NOT NULL,
    "questions_answered" INTEGER NOT NULL DEFAULT 0,
    "wrong_answers" INTEGER NOT NULL DEFAULT 0,
    "correct_answers" INTEGER NOT NULL DEFAULT 0,
    "favorite_category" TEXT,
    "experience" INTEGER NOT NULL DEFAULT 0,
    "profileImage" TEXT DEFAULT '/src/assets/img/default_profile/profile.jpg',
    "created_at" DATETIME NOT NULL DEFAULT CURRENT_TIMESTAMP,
    "updated_at" DATETIME NOT NULL
);
INSERT INTO "new_users" ("correct_answers", "created_at", "email", "experience", "favorite_category", "id", "login", "password", "profileImage", "questions_answered", "updated_at", "wrong_answers") SELECT "correct_answers", "created_at", "email", "experience", "favorite_category", "id", "login", "password", "profileImage", "questions_answered", "updated_at", "wrong_answers" FROM "users";
DROP TABLE "users";
ALTER TABLE "new_users" RENAME TO "users";
CREATE UNIQUE INDEX "users_email_key" ON "users"("email");
CREATE UNIQUE INDEX "users_login_key" ON "users"("login");
PRAGMA foreign_keys=ON;
PRAGMA defer_foreign_keys=OFF;
