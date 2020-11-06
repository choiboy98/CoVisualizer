import psycopg2
from config import config


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
            id SERIAL PRIMARY KEY,
            coordinates VARCHAR(255) UNIQUE,
            net_id VARCHAR(255) NOT NULL UNIQUE,
            risk VARCHAR(255) NOT NULL,
            location_name VARCHAR(255) NOT NULL,
            time_spent FLOAT NOT NULL,
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