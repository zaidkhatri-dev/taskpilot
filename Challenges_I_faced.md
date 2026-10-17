1. How to ensure uniqueness of username, email at db level
   -> Always store username, email in lowecase. Then define a BEFORE TRIGGER ON INSERT/UPDATE to trim, lowercase before insert/update. Then add a unique constraint on username, email.

2. useActionState hook does not provide event object to stop form defaul reset
   -> Return input values from server action and make them defaultValue for input fields
