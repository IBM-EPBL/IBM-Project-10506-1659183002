# Personal Expense Tracker

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
5. Create ```Sendgrid api key``` and Add it to ```SEND GRID``` section also Add ```FROM_MAIL```.
6. Add ```BASE_URL```
      
      For EG:  If the Link for confirm.html is
      http://localhost:5500/[Your_folder_path]/frontend/confirm.html
      Then Add
      http://localhost:5500/[Your_folder_path]/frontend
# Start Frontend
1. Start it by liveserver using vscode.
> ### Note: Make sure the link is ```localhost``` and not ```127.0.0.1```. If it's in ```127.0.0.1``` convert it to ```localhost```
# Start Backend
> ### Note: Make sure you are in ```backend``` folder
```shell
flask --app flaskr --debug run
```
