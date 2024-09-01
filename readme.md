Prerequisites
Before running the project, you need to have the following installed:

- Node.js (version 10 or later)
- XAMPP (or another software package that includes Apache, MySQL, and PHP)
- in cmd `git clone https://github.com/Complaints-Analysis-GP-Team/Complaints_Analysis_System.git`
- `cd Complaints_Analysis_System`
- `npm install`
- Start the Apache and MySQL modules in XAMPP. If you are using XAMPP, you can start the modules by opening the XAMPP Control Panel and clicking the "Start" button next to Apache and MySQL.
- Open phpMyAdmin by typing "http://localhost/phpmyadmin" into a web browser. This will open the phpMyAdmin interface in your browser.
- Create a new database by clicking on the "New" button on the left-hand side of the phpMyAdmin interface. Enter `gcp` as your database name.
- run the server by executing the command `npm start`
_____________________________

______________ APIs ______________
 BASE_URL:localhost:5000/

USER ->

    citizen signup                      (POST) --> localhost:5000/user/signup/citizen
    Employee signup  (Admin only)       (POST) --> localhost:5000/user/signup/employee
    Confirm e-mail                      (GET)  --> localhost:5000/user/confirmEmail/:token
    users login (Any type of users)     (POST) --> localhost:5000/user/login
    get profile  (profile owner)        (GET)  --> localhost:5000/user/profile
    update profile (profile owner)      (PUT)  --> localhost:5000/user/update

COMPLAINT ->

    All Complaint (Admin)               (GET)  --> localhost:5000/complaints/
    Sector Complaints (Employee)        (GET)  --> localhost:5000/complaints/sector/
    Employee Complaints                 (GET)  --> localhost:5000/complaints/employee
    Citizen Complaints (History)        (GET)  --> localhost:5000/complaints/history
    Add complaint (Citizeb)             (POST) --> localhost:5000/complaints/add
    Update complaint (Citizen)          (PUT)  --> localhost:5000/complaints/update/:id
    Delete complaint (Citizen)          (DELETE) --> localhost:5000/complaints/delete/:id

COMMENTS ->
    Add comment (Employee, Citizen)     (POST) --> localhost:5000/comments/add/:id




