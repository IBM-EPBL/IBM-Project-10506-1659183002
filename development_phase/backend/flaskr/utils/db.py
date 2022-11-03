import ibm_db
from ..config.db_config import get_db_credential

conn=ibm_db.connect(get_db_credential(),"","")

def run_sql_select(query,params=None):
    try:
        stmt=ibm_db.prepare(conn,query)
        if(params==None):
            ibm_db.execute(stmt)
            data=ibm_db.fetch_assoc(stmt)
            return data
        ibm_db.execute(stmt,params)
        data=ibm_db.fetch_assoc(stmt)
        return data
    except: 
        return False

def run_sql_insert(query,params):
    try:
        stmt=ibm_db.prepare(conn,query)
        ibm_db.execute(stmt,params)
        return True
    except:
        return False

def run_sql_update(query, params):
    try:
        stmt=ibm_db.prepare(conn, query)
        ibm_db.execute(stmt, params)
        return True

    except:
        return False