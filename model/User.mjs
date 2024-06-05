export class User {
    email;
    password;
    firstName;
    lastName;
    role;

    constructor({ email, password, firstName, lastName, role = 'user' }) {
        this.email = email;
        this.password = password;
        this.firstName = firstName;
        this.lastName = lastName;
        this.role = role;
    }
  }