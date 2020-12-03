from flask import Blueprint, request, json
from api.core import create_response, serialize_list, logger
import psycopg2
import os
from config import config
from datetime import datetime

location = Blueprint("location", __name__)

@location.route("/all_location", methods=["GET"])
def get_all_location():
    """
    get all location
    """
    # gets database values from query string, if missing is None
    sql = """SELECT coordinates, time_spent, net_id FROM location;"""
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql)
        print("here")
        items = cur.fetchall()
        print(items)
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()
    
    if items != None:
        result = []
        for entry in items:
            output = {}
            output_route = []
            output_dur = []
            
            stored_routes = entry[0]
            stored_duration = entry[1]
            
            stored_routes = stored_routes.split("|")
            stored_duration = stored_duration.split("|")
            for route in stored_routes:
                temp = {}
                curr = route.split(",")
                temp["latitude"] = float(curr[0])
                temp["longitude"] = float(curr[1])
                output_route.append(temp)
            for dur in stored_duration:
                output_dur.append(int(dur))
            output["duration"] = output_dur
            output["route"] = output_route
            output["netid"] = entry[2]
            result.append(output)
        return create_response(
            status=200,
            data={"result": result},
        )
    return create_response(
        status=400,
        data=None,
    )


@location.route("/get_location", methods=["POST"])
def get_location():
    """
    get location based on net_id
    """
    # gets database values from query string, if missing is None
    data = request.form

    if len(data) == 0:
        return create_response(status=400, message="No body provided for person")
    coordinates = data.get("coordinates")
    net_id = data.get("net_id")

    sql = """SELECT * FROM location WHERE coordinates=%s AND net_id = %s;"""
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (coordinates, net_id))
        items = cur.fetchone()
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    output = {"coordinates": items[0], "net_id": items[1], "risk": items[2], "location_name": items[3], "time_spent": items[4]}

    return create_response(
        status=200,
        data=output,
    )


@location.route("/location/<coordinates>", methods=["PUT"])
def update_location(coordinates):
    """
    update infected status for specified location
    """
    data = request.form

    if len(data) == 0:
        return create_response(status=400, message="No body provided for location")

    risk = data.get("risk")
    sql = """ UPDATE location
                SET risk = %s
                WHERE coordinates = %s"""
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (risk, coordinates))
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    return create_response(status=200, message="updated successfully")


@location.route("/location", methods=["POST"])
def create_new_location():
    """
    create new location upon finish tracking
    """
    data = request.form

    if len(data) == 0:
        return create_response(status=400, message="No body provided for new location")

    coordinates = data.get("coordinates")
    net_id = data.get("net_id")
    risk = data.get("risk")
    location_name = data.get("location_name")
    time_spent = data.get("time_spent")
    sql = """INSERT INTO location
             VALUES(%(coordinates)s, %(net_id)s, %(risk)s, %(location_name)s, %(time_spent)s);"""
    conn = None
    items = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        print(data)
        cur.execute(sql, data)
        # items = cur.fetchone()
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    # output = {"id": items[0], "coordinates": items[1], "net_id": items[2], "risk": items[3], "location_name": items[4], "time_spent": items[5]}
    return create_response(status=200, message="successfully added new location")

@location.route("/location/<id>", methods=["DELETE"])
def delete_location(id):
    """
    create new location upon finish tracking
    """
    data = request.form
    print(request.json)
    print(request.values)
    print(request.args)
    print(id)
    print(data)

    if len(data) == 0:
        return create_response(status=400, message="No body provided for new location")

    coordinates = data.get("coordinates")
    sql = """DELETE FROM location WHERE coordinates = %s AND net_id = %s;"""
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (coordinates, id))
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    return create_response(status=200, message="successfully deleted location")

@location.route("/location/<risk>", methods=["risklevel"])
def risklevel(id):
    """
    determine the risk level of the current path
    """
    data = request.form
    if len(data) == 0:
        return create_response(status=400, message="No body provided for location")

    risk = data.get("risk")
    sql = """ SELECT coordinates, COUNT(risk) FROM location INNER JOIN infection on location.coordinates = infection.coordinates
            GROUP BY location.coordinates HAVING infection.status = TRUE ORDER BY location.risk DESC, location.coordinates ASC"""
    conn = None
    try:
        params = config()
        conn = psycopg2.connect(**params)
        cur = conn.cursor()
        cur.execute(sql, (risk, coordinates))
        conn.commit()
        cur.close()
    except (Exception, psycopg2.DatabaseError) as error:
        return create_response(status=500, message=error)
    finally:
        if conn is not None:
            conn.close()

    return create_response(status=200, message="updated successfully")