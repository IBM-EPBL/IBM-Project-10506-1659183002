# Personal Expense Tracker - SPENCY

## Spency is Live @ 
 * Main site [http://169.51.194.117:31320/](http://169.51.194.117:31320/)
 * [Demo Video](https://youtu.be/RcO0kYkbAzY)

# Setting up environment

1. Go to backend
  ```shell
  cd backend
  ```
2. Initiate virtual environment
  ```shell
  python3 -m venv venv
  ```
3. Activate Virtual environment
  ```shell
  source venv/bin/activate
  ```
4. Install Required Python packages
  ```shell
  pip install -r requirements.txt
  ``` 
# Set Up ```.env``` file
> ### Note: Make sure you are in ```backend``` folder
1. Create ```.env``` file
  ```shell
  touch .env
  ```
2. Copy data from [.env.example](https://github.com/IBM-EPBL/IBM-Project-10506-1659183002/blob/website/development_phase/backend/.env.example) and paste it in ```.env```
3. Create ```IBM DB2``` credential and Add it to ```Database Creadential ibm DB2``` section in .env.
4. Create ```Random Key``` for ```Secret Key``` section.
5. Create ```Sendgrid api key``` and Add it to ```SEND GRID``` section.
6. Add ```BASE_URL```
      
      For EG:  If the Link for confirm.html is
      http://localhost:5500/[Your_folder_path]/frontend/confirm.html
      Then Add
      http://localhost:5500/[Your_folder_path]/frontend

# Set Up Database

1. Create the Following table with this [SQL](https://github.com/IBM-EPBL/IBM-Project-10506-1659183002/blob/main/Final%20Deliverables/backend/sql/schema.sql)

# Set up Sendgrid and template

1. Verify the sender [here](https://app.sendgrid.com/settings/sender_auth/senders)
2. Create two ```Dynamic Template``` [here](https://mc.sendgrid.com/dynamic-templates)
   1. Confirmation E-Mail template with the following variable 

      ```json
      {
       "confirm_url": "Confirm_url"
      }
      ```
   2. Usage Alert template with the following variable
      ```json
      {
        "total_amount": 5000,
        "pending_amount": 100,
        "percentage": 98,
        "date": "10/10/2001",
        "next_date":"10/10/2001" 
      }
      ```
# Start Frontend
> ### Note: Make sure you are in ```frontend``` folder
1. Install the necessary packages by
```shell
npm install
```
2. Start the srever
 ```shell
 npm start
 ```
# Start Backend
> ### Note: Make sure you are in ```backend``` folder
```shell
gunicorn -w 4 -b 0.0.0.0:5000 wsgi:app
```
