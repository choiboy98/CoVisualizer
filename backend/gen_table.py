import psycopg2
from sqlalchemy import *
from config import host, port, database, user, password

conn_str = f"postgresql://{user}:{password}@{host}/{database}"
engine = create_engine(conn_str)
connection = engine.connect()
metadata = MetaData()
first_tb = Table('first_table', metadata,
   Column('id', Integer, primary_key=True),
   Column('name', String(255), nullable=False),
   Column('isHappy', Boolean, nullable=False)
)
metadata.create_all(engine)
query = insert(first_tb).values(id=1, name="Student", isHappy=True)
ResultProxy = connection.execute(query)


def create_tables():
    """ create tables in the PostgreSQL database"""
    commands = (
        """
        CREATE TABLE person (
            net_id VARCHAR(255) PRIMARY KEY,
            name VARCHAR(255) NOT NULL,
            email VARCHAR(255) NOT NULL,
            phone VARCHAR(255) NOT NULL,
            infected VARCHAR(255) NOT NULL
        )
        """,
        """ 
        CREATE TABLE location (
            coordinates VARCHAR(255) UNIQUE PRIMARY KEY,
            net_id VARCHAR(255) NOT NULL,
            risk VARCHAR(255) NOT NULL,
            location_name VARCHAR(255) NOT NULL,
            time_spent VARCHAR(255) NOT NULL,
            FOREIGN KEY (net_id)
                REFERENCES person (net_id)
                ON UPDATE CASCADE ON DELETE CASCADE
        )    
        """,
        """
        CREATE TABLE infection (
                coordinates VARCHAR(255) PRIMARY KEY,
                num_people_visited VARCHAR(255) NOT NULL,
                num_infected_people VARCHAR(255) NOT NULL,
                risk VARCHAR(255) NOT NULL,
                FOREIGN KEY (coordinates)
                    REFERENCES location (coordinates)
                    ON UPDATE CASCADE ON DELETE CASCADE
        )
        """)
    conn = None
    try:
        # read the connection parameters
        params = config()
        # connect to the PostgreSQL server
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        # create table one by one
        for command in commands:
            cur.execute(command)
        # close communication with the PostgreSQL database server
        cur.close()
        # commit the changes
        conn.commit()
    except (Exception, psycopg2.DatabaseError) as error:
        print(error)
    finally:
        if conn is not None:
            conn.close()


if __name__ == '__main__':
    create_tables()