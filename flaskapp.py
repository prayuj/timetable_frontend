from flask import Flask, escape, request
from flask_cors import CORS
import pickle
import random
import numpy as np
import ast
import os
from flask_pymongo import PyMongo
from bson.binary import Binary
from bson.objectid import ObjectId
import hashlib

app = Flask(__name__)
app.config["MONGO_URI"] = "mongodb://localhost:27017/timetable"
mongo = PyMongo(app)
cors = CORS(app)
print(mongo)


class Course:
    def __init__(self, id, name, no_of_hours, no_of_valid_rooms, valid_rooms, max_no_hours_per_day, max_consecutive_hours, no_of_hours_to_schedule_when_assigning, day_count_dict, class_flag, batch_flag):
        self.id = id
        self.name = name
        self.no_of_hours = no_of_hours
        self.no_of_valid_rooms = no_of_valid_rooms
        self.valid_rooms = valid_rooms
        self.max_no_hours_per_day = max_no_hours_per_day
        self.max_consecutive_hours = max_consecutive_hours
        self.no_of_hours_to_schedule_when_assigning = no_of_hours_to_schedule_when_assigning
        self.day_count_dict = day_count_dict
        self.class_flag = class_flag
        self.batch_flag = batch_flag


class Student_Group:
    def __init__(self, id, name, courses):
        self.id = id
        self.name = name
        self.courses = courses


class Lecturer:
    def __init__(self, id, name, department, max_no_hours_per_day, max_no_hours_per_week, max_consecutive_hours, rank, availability, courses, day_count_dict):
        self.id = id
        self.name = name
        self.department = department
        self.max_no_hours_per_day = max_no_hours_per_day
        self.max_no_hours_per_week = max_no_hours_per_week
        self.max_consecutive_hours = max_consecutive_hours
        self.rank = rank
        self.availability = availability
        self.courses = courses
        self.day_count_dict = day_count_dict


class Room:
    def __init__(self, id, name):
        self.id = id
        self.name = name


class Day:
    def __init__(self, id, name):
        self.id = id
        self.name = name


class Hour:
    def __init__(self, id, name, status):
        self.id = id
        self.name = name
        self.status = status


@app.route("/user/register", methods=["POST"])
def register():
    data = request.get_json()
    data["password"] = hashlib.md5(data["password"].encode()).hexdigest()
    if mongo.db.users.find_one({"email": data["email"]}) is None:
        result = mongo.db.users.insert_one(data).inserted_id
        return {"registered": True, "objectID": str(result)}
    return {"registered": False}


@app.route("/user/login", methods=["POST"])
def login():
    data = request.get_json()
    data["password"] = hashlib.md5(data["password"].encode()).hexdigest()
    print(data)
    result = mongo.db.users.find_one(data)
    if result is None:
        return {"loggedIn": False}
    return {"loggedIn": True, "objectID": str(result["_id"])}


@app.route("/newtimetable", methods=["POST"])
def newtimetable():
    data = request.get_json()
    data["userid"] = ObjectId(data["userid"])
    data["data"] = {
        "days": [""],
        "hours": [{
            "name": "",
            "status": True
        }],
        "rooms": [""],
        "courses": [{
            "course_id": "",
            "course_name": "",
            "no_of_hours_to_schedule_when_assigning": "",
            "max_no_hours_per_day": "",
            "no_hours_per_week": "",
            "max_consecutive_hours_per_day": "",
            "valid_rooms": [""]
        }],
        "student_groups": [{
            "name": "",
            "courses": [""]

        }],
        "lecturers": [{
            "name": "",
            "department": "",
            "max_no_hours_per_day": "",
            "max_no_hours_per_week": "",
            "max_consecutive_hours": "",
            "rank": "",
            "availability": [[True]],
            "courses": [""]
        }],
        "population_size": 20,
        "iterations": 10
    }

    data["current"] = "input"
    result = mongo.db.user_timetables.insert_one(data).inserted_id
    return {"status": "done", "timetableObjectID": str(result)}


@app.route("/updatetimetabledetails", methods=["POST"])
def updatetimetabledetails():
    data = request.get_json()
    data["timetableObjectID"] = ObjectId(data["timetableObjectID"])
    result = mongo.db.user_timetables.update_one({"_id": data["timetableObjectID"]}, {
                                                 "$set": {"title": data["title"], "desc": data["desc"]}})
    return {"status": "done", "timetableObjectID": str(data["timetableObjectID"])}


@app.route("/timetabledetails/user=<userid>&timetableObjectID=<timetableObjectID>", methods=["GET"])
def timetabledetails(userid, timetableObjectID):
    print(userid, timetableObjectID)
    result = mongo.db.user_timetables.find_one(
        {"userid": ObjectId(userid), "_id": ObjectId(timetableObjectID)}, {"_id": 0, "title": 1, "desc": "1", "data": 1, "chart_data": 1, "population": 1, "start_index": 1, "generation": 1, "generation_with_maximum": 1, "maximum_chromosome": 1})

    return result


@app.route("/gettimetables/<userid>", methods=["GET"])
def gettimetables(userid):
    query = mongo.db.user_timetables.find(
        {"userid": ObjectId(userid)}, {"_id": 1, "title": 1, "desc": 1})
    result = []
    for r in query:
        print(r)
        r["_id"] = str(r["_id"])
        result.append(r)
    return {"timetables": result}


@app.route("/deletetimetable", methods=["POST"])
def deletetimetable():
    data = request.get_json()
    print(data)
    result = mongo.db.chromosome_to_fitness.delete_many(
        {"timetableObjectID": ObjectId(data["timetableObjectID"])})
    result = mongo.db.target_matrix.delete_many(
        {"timetableObjectID": ObjectId(data["timetableObjectID"])})
    result = mongo.db.user_timetables.delete_many(
        {"_id": ObjectId(data["timetableObjectID"])})

    return {"status": "done"}


@app.route("/update_timetable", methods=["POST"])
def update_timetable():
    data = request.get_json()

    course_list = []
    lecturer_list = []
    student_group_list = []
    rooms_list = []
    days_list = []
    hours_list = []
    no_of_days = -1
    no_of_hours = -1
    day_dictionary = {}
    hour_dictionary = {}
    lecturer_dictionary = {}
    student_group_dictionary = {}
    course_dictionary = {}
    room_dictionary = {}
    columns = {}
    hours_for_columns = {}
    rows = {}
    rows_invert = {}
    total_hours = 0

    count = 0
    for day in data["days"]:
        days_list.append(Day(count, day))
        count += 1
    no_of_days = count

    count = 0
    for hour in data["hours"]:
        hours_list.append(Hour(count, hour["name"], hour["status"]))
        count += 1
    no_of_hours = count
    print(hours_list[0].status)

    count = 0
    for room in data["rooms"]:
        rooms_list.append(Room(count, room))
        count += 1

    count = 0
    for course in data["courses"]:
        day_count_dict = {}
        for day_index in range(no_of_days):
            day_count_dict[day_index] = 0
        course_list.append(Course(course["course_id"], course["course_name"], int(course["no_hours_per_week"]), len(course["valid_rooms"]), course["valid_rooms"],
                                  int(course["max_no_hours_per_day"]), int(course["max_consecutive_hours_per_day"]), int(course["no_of_hours_to_schedule_when_assigning"]), day_count_dict, False, False))
        count += 1

    count = 0
    for student_group in data["student_groups"]:
        student_group_list.append(Student_Group(
            count, student_group["name"], student_group["courses"]))
        count += 1

    count = 0
    for lecturer in data["lecturers"]:
        day_count_dict = {}
        for day_index in range(no_of_days):
            day_count_dict[day_index] = 0
        lecturer_list.append(Lecturer(count, lecturer["name"], lecturer["department"], int(lecturer["max_no_hours_per_day"]), int(lecturer["max_no_hours_per_week"]),
                                      int(lecturer["max_consecutive_hours"]), lecturer["rank"], lecturer["availability"], lecturer["courses"], day_count_dict))
        count += 1

    for day in days_list:
        day_dictionary[day.id] = day

    for hour in hours_list:
        hour_dictionary[hour.id] = hour

    for lecturer in lecturer_list:
        lecturer_dictionary[lecturer.id] = lecturer

    for student_group in student_group_list:
        student_group_dictionary[student_group.id] = student_group

    for course in course_list:
        course_dictionary[course.id] = course

    for room in rooms_list:
        room_dictionary[room.id] = room

    count = 0
    for lecturer in lecturer_list:
        for course in lecturer.courses:
            if "all" in course:
                course = course.split()[0]
                for student_group in student_group_list:
                    if course in student_group.courses:
                        i = course_dictionary[course].no_of_hours
                        while i > 0:
                            columns[count] = {
                                "lecturer": lecturer.id, "student_group": student_group.id, "course": course, "subset": "all"}
                            hours_for_columns[count] = course_dictionary[course].no_of_hours_to_schedule_when_assigning
                            i -= course_dictionary[course].no_of_hours_to_schedule_when_assigning
                            count += 1
            elif "Batch-" in course:
                course, batch = course.split()
                batch = batch.split('-')[1]
                for student_group in student_group_list:
                    if course in student_group.courses:
                        i = course_dictionary[course].no_of_hours
                        while i > 0:
                            columns[count] = {"lecturer": lecturer.id, "student_group": student_group.id,
                                              "course": course, "subset": "batch", "batch": batch}
                            hours_for_columns[count] = course_dictionary[course].no_of_hours_to_schedule_when_assigning
                            i -= course_dictionary[course].no_of_hours_to_schedule_when_assigning
                            count += 1
            elif "Group" in course:
                course, group = course.split()
                group = group.split('_')[1]
                for student_group in student_group_list:
                    if course in student_group.courses:
                        i = course_dictionary[course].no_of_hours
                        while i > 0:
                            columns[count] = {"lecturer": lecturer.id, "student_group": student_group.id,
                                              "course": course, "subset": "group", "batch": group}
                            hours_for_columns[count] = course_dictionary[course].no_of_hours_to_schedule_when_assigning
                            i -= course_dictionary[course].no_of_hours_to_schedule_when_assigning
                            count += 1

    print("Length of Columns:", len(columns))

    for day in days_list:
        hour_temp_dict = {}
        for hour in hours_list:
            room_temp_dict = {}
            for room in rooms_list:
                room_temp_dict[room.id] = 0
            hour_temp_dict[hour.id] = room_temp_dict
        rows_invert[day.id] = hour_temp_dict

    count = 0

    for room in rooms_list:
        for day in days_list:
            for hour in hours_list:
                rows[count] = {"day": day.id, "hour": hour.id, "room": room.id}
                rows_invert[day.id][hour.id][room.id] = count
                count += 1
    column_numbers = [x for x in range(0, len(columns))]
    total_hours = 0
    for hours in hours_for_columns:
        total_hours += hours_for_columns[hours]

    population = []
    while len(population) < data["population_size"]:
        q = column_numbers.copy()
        random.shuffle(q)
        if q not in population:
            population.append(q)

    color_for_columns = {}
    for key, val in columns.items():
        color_for_columns[str(val)] = "#"+hex(random.randint(128, 255)).lstrip("0x")+hex(
            random.randint(128, 255)).lstrip("0x")+hex(random.randint(128, 255)).lstrip("0x")

    result = mongo.db.chromosome_to_fitness.delete_many(
        {"timetableObjectID": ObjectId(data["timetableObjectID"])})
    result = mongo.db.target_matrix.delete_many(
        {"timetableObjectID": ObjectId(data["timetableObjectID"])})
    result = mongo.db.chromosome_to_target_matrix.delete_many(
        {"timetableObjectID": ObjectId(data["timetableObjectID"])})

    result = mongo.db.user_timetables.update_one(
        {"_id": ObjectId(data["timetableObjectID"])}, {"$set": {"data": {
            "days": data["days"],
            "hours": data["hours"],
            "rooms": data["rooms"],
            "courses": data["courses"],
            "student_groups": data["student_groups"],
            "lecturers": data["lecturers"],
            "population_size": data["population_size"],
            "iterations": data["iterations"]},
            "no_of_days":   no_of_days,
            "no_of_hours":  no_of_hours,
            "day_dictionary": Binary(pickle.dumps(day_dictionary)),
            "hour_dictionary": Binary(pickle.dumps(hour_dictionary)),
            "room_dictionary": Binary(pickle.dumps(room_dictionary)),
            "lecturer_dictionary": Binary(pickle.dumps(lecturer_dictionary)),
            "student_group_dictionary": Binary(pickle.dumps(student_group_dictionary)),
            "course_dictionary": Binary(pickle.dumps(course_dictionary)),
            "columns": Binary(pickle.dumps(columns)),
            "hours_for_columns": Binary(pickle.dumps(hours_for_columns)),
            "rows": Binary(pickle.dumps(rows)),
            "rows_invert": Binary(pickle.dumps(rows_invert)),
            "total_hours": Binary(pickle.dumps(day_dictionary)),
            "chart_data": [
            ["x", "maximum", "average", "minimum"]],
            "population": population,
            "generation": 0,
            "start_index": 0,
            "color_for_columns": color_for_columns,
            "current": "generation",
        }, "$unset": {"maximum_chromosome": "", "generation_with_maximum": "", "i": ""}})
    return {"status": "done"}


def getValidDays(no_of_days, rows, columns, target_matrix, lecturer_id, course_id, lecturer_max_no_hours_per_day, course_max_no_hours_per_day, lecturer_dictionary, course_dictionary):
    day_flag = [False] * no_of_days
    lecturer_day_count_dict = lecturer_dictionary[lecturer_id].day_count_dict
    course_day_count_dict = course_dictionary[course_id].day_count_dict
    for day in range(no_of_days):
        if lecturer_max_no_hours_per_day > lecturer_day_count_dict[day] and course_max_no_hours_per_day > course_day_count_dict[day]:
            day_flag[day] = True
    return day_flag


def getValidRows(rows, target_matrix, column_number, day_flag, room_dictionary, valid_rooms, no_of_hours_to_schedule_when_assigning, lecturer_availability, no_of_hours):
    valid_rows = []
    for i in range(len(rows)):
        day = rows[i]["day"]
        hour = rows[i]["hour"]
        if target_matrix[i][column_number] == 0 and day_flag[day]:
            if room_dictionary[rows[i]["room"]].name in valid_rooms:
                try:
                    flag = True
                    for j in range(no_of_hours_to_schedule_when_assigning):
                        if rows[i]['hour'] + j != rows[i+j]['hour'] or lecturer_availability[day][hour+j] == False or target_matrix[i+j][column_number] != 0:
                            flag = False
                            break
                    if flag:
                        valid_rows.append(i)
                except:
                    pass
    return valid_rows


def no_batch_conflicts(subset, target_matrix, rows, columns, day, hour, batch, student_group_id, course_id, lecturer_id):
    for i in range(len(rows)):
        current_day = rows[i]["day"]
        current_hour = rows[i]["hour"]
        if current_day == day and current_hour == hour:
            for j in range(len(columns)):
                if columns[j]["subset"] == subset and columns[j]["student_group"] == student_group_id and target_matrix[i][j] == 1:
                    if columns[j]["batch"] == batch or columns[j]["lecturer"] == lecturer_id or columns[j]["course"] == course_id:
                        return False
    return True


def updatedScheduleCourse(valid_rows, rows_invert, no_of_hours_to_schedule_when_assigning, rows, columns, target_matrix, lecturer_id, student_group_id, column_number, lecturer_dictionary, course_dictionary):
    # row_id_to_schedule = random.choice(valid_rows)
    row_id_to_schedule = valid_rows[0]
    no_of_hours_scheduled = 0
    for k in range(no_of_hours_to_schedule_when_assigning):
        day = rows[row_id_to_schedule+k]["day"]
        hour = rows[row_id_to_schedule+k]["hour"]
        room = rows[row_id_to_schedule+k]["room"]
    # print(day, hour,room_dictionary[room].name)

        for j in range(len(columns)):
            target_matrix[row_id_to_schedule+k][j] = -1

        for j in range(len(columns)):
            if columns[j]["lecturer"] == lecturer_id or columns[j]["student_group"] == student_group_id:
                for key, val in rows_invert[day][hour].items():
                    target_matrix[val][j] = -1
        try:
            for key, val in rows_invert[day][hour+course_dictionary[columns[column_number]["course"]].max_consecutive_hours].items():
                for j in range(len(columns)):
                    if columns[j]["course"] == columns[column_number]["course"]:
                        target_matrix[val][j] = -1
        except:
            pass
        lecturer_dictionary[lecturer_id].day_count_dict[day] += 1
        course_dictionary[columns[column_number]
                          ["course"]].day_count_dict[day] += 1
        target_matrix[row_id_to_schedule+k][column_number] = 1
        no_of_hours_scheduled += 1
    return target_matrix, no_of_hours_scheduled


def fillTargetMatrix(target_matrix_template, column_numbers, columns, hours_for_columns, rows, rows_invert, day_dictionary, hour_dictionary, room_dictionary, lecturer_dictionary, student_group_dictionary, course_dictionary, no_of_days, no_of_hours, total_hours):
    target_matrix = target_matrix_template
    no_hours_not_scheduled = 0
    scheduled_batch_slot = {}
    for column_number in column_numbers:
        if columns[column_number]["subset"] == "all":
            course_id = columns[column_number]['course']
            lecturer_id = columns[column_number]['lecturer']
            student_group_id = columns[column_number]['student_group']
            no_of_hours_to_schedule = hours_for_columns[column_number]
            no_of_hours_to_schedule_when_assigning = course_dictionary[
                course_id].no_of_hours_to_schedule_when_assigning
            while no_of_hours_to_schedule > 0:
                day_flag = getValidDays(no_of_days, rows, columns, target_matrix, lecturer_id, course_id,
                                        lecturer_dictionary[lecturer_id].max_no_hours_per_day, course_dictionary[course_id].max_no_hours_per_day, lecturer_dictionary, course_dictionary)
                valid_rows = getValidRows(rows, target_matrix, column_number, day_flag, room_dictionary,
                                          course_dictionary[course_id].valid_rooms, no_of_hours_to_schedule_when_assigning, lecturer_dictionary[lecturer_id].availability, no_of_hours)
                if len(valid_rows) == 0:
                    no_hours_not_scheduled += no_of_hours_to_schedule
                    break
                target_matrix, no_of_hours_scheduled = updatedScheduleCourse(
                    valid_rows, rows_invert, no_of_hours_to_schedule_when_assigning, rows, columns, target_matrix, lecturer_id, student_group_id, column_number, lecturer_dictionary, course_dictionary)
                no_of_hours_to_schedule -= no_of_hours_scheduled

        else:
            course_id = columns[column_number]['course']
            lecturer_id = columns[column_number]['lecturer']
            student_group_id = columns[column_number]['student_group']
            no_of_hours_to_schedule = hours_for_columns[column_number]
            batch = columns[column_number]["batch"]
            subset = columns[column_number]["subset"]
            no_of_hours_to_schedule_when_assigning = course_dictionary[
                course_id].no_of_hours_to_schedule_when_assigning
            while no_of_hours_to_schedule > 0:
                day_flag = getValidDays(no_of_days, rows, columns, target_matrix, lecturer_id, course_id,
                                        lecturer_dictionary[lecturer_id].max_no_hours_per_day, course_dictionary[course_id].max_no_hours_per_day, lecturer_dictionary, course_dictionary)
                valid_rows = getValidRows(rows, target_matrix, column_number, day_flag, room_dictionary,
                                          course_dictionary[course_id].valid_rooms, no_of_hours_to_schedule_when_assigning, lecturer_dictionary[lecturer_id].availability, no_of_hours)
                if len(valid_rows) == 0:
                    no_hours_not_scheduled += no_of_hours_to_schedule
                    break
                scheduled_flag = False
                for key, val in scheduled_batch_slot.items():
                    if columns[val]["student_group"] == student_group_id and columns[val]["subset"] == subset and columns[val]["batch"] != batch:
                        day = rows[key]["day"]
                        hour = rows[key]["hour"]
                        for o in valid_rows:
                            if rows[o]["day"] == day and rows[o]["hour"] == hour:
                                for k in range(no_of_hours_to_schedule_when_assigning):
                                    day = rows[o+k]["day"]
                                    hour = rows[o+k]["hour"]
                                    room = rows[o+k]["room"]

                                    for j in range(len(columns)):
                                        target_matrix[o+k][j] = -1

                                    for j in range(len(columns)):
                                        if columns[j]["lecturer"] == lecturer_id:
                                            for key, val in rows_invert[day][hour].items():
                                                target_matrix[val][j] = -1
                                        elif columns[j]["student_group"] == student_group_id and columns[j]["subset"] != subset:
                                            for key, val in rows_invert[day][hour].items():
                                                target_matrix[val][j] = -1
                                        elif columns[j]["student_group"] == student_group_id and columns[j]["subset"] == subset and columns[j]["batch"] == batch:
                                            for key, val in rows_invert[day][hour].items():
                                                target_matrix[val][j] = -1

                                    lecturer_dictionary[lecturer_id].day_count_dict[day] += 1
                                    course_dictionary[columns[column_number]
                                                      ["course"]].day_count_dict[day] += 1
                                    target_matrix[o+k][column_number] = 1
                                    scheduled_flag = True
                                    no_of_hours_to_schedule -= 1
                                break
                        if scheduled_flag:
                            break

                # Else Randomly Schedule
                if scheduled_flag == False:
                    row_id_to_schedule = valid_rows[0]
                    for k in range(no_of_hours_to_schedule_when_assigning):
                        day = rows[row_id_to_schedule+k]["day"]
                        hour = rows[row_id_to_schedule+k]["hour"]
                        room = rows[row_id_to_schedule+k]["room"]

                        for j in range(len(columns)):
                            target_matrix[row_id_to_schedule+k][j] = -1

                        for j in range(len(columns)):
                            if columns[j]["lecturer"] == lecturer_id:
                                for key, val in rows_invert[day][hour].items():
                                    target_matrix[val][j] = -1
                            elif columns[j]["student_group"] == student_group_id and columns[j]["subset"] != subset:
                                for key, val in rows_invert[day][hour].items():
                                    target_matrix[val][j] = -1
                            elif columns[j]["student_group"] == student_group_id and columns[j]["subset"] == subset and columns[j]["batch"] == batch:
                                for key, val in rows_invert[day][hour].items():
                                    target_matrix[val][j] = -1

                        scheduled_batch_slot[row_id_to_schedule +
                                             k] = column_number
                        lecturer_dictionary[lecturer_id].day_count_dict[day] += 1
                        course_dictionary[columns[column_number]
                                          ["course"]].day_count_dict[day] += 1
                        target_matrix[row_id_to_schedule+k][column_number] = 1
                        no_of_hours_to_schedule -= 1

    return target_matrix, 100 - (no_hours_not_scheduled * 100)/total_hours


@app.route("/fill_target_matrix", methods=["POST"])
def handle_fill_target_matrix():
    data = request.get_json()
    # data={
    #   "generation":1,
    #   "timetableObjectID":"5e91c6a3e9b32df71a4808e4",
    #   "column_numbers":Array}
    print(data)

    generation = data["generation"]
    result = mongo.db.user_timetables.find_one(
        {"_id": ObjectId(data["timetableObjectID"])})
    no_of_days = result["no_of_days"]
    no_of_hours = result["no_of_hours"]
    day_dictionary = pickle.loads(result["day_dictionary"])
    hour_dictionary = pickle.loads(result["hour_dictionary"])
    room_dictionary = pickle.loads(result["room_dictionary"])
    lecturer_dictionary = pickle.loads(result["lecturer_dictionary"])
    student_group_dictionary = pickle.loads(result["student_group_dictionary"])
    course_dictionary = pickle.loads(result["course_dictionary"])
    columns = pickle.loads(result["columns"])
    hours_for_columns = pickle.loads(result["hours_for_columns"])
    rows = pickle.loads(result["rows"])
    rows_invert = pickle.loads(result["rows_invert"])
    generation = data["generation"]
    column_numbers = data["column_numbers"]
    target_matrix_template = np.zeros((len(rows), len(columns)))
    for i in range(len(rows)):
        if not hour_dictionary[rows[i]["hour"]].status:
            for j in range(len(columns)):
                target_matrix_template[i][j] = -1
    target_matrix, fitness = fillTargetMatrix(target_matrix_template, column_numbers, columns, hours_for_columns, rows, rows_invert, day_dictionary,
                                              hour_dictionary, room_dictionary, lecturer_dictionary, student_group_dictionary, course_dictionary, no_of_days, no_of_hours, total_hours=210)

    res = mongo.db.chromosome_to_fitness.update_one({"timetableObjectID": ObjectId(data["timetableObjectID"]), "generation": generation, "i": data["i"]}, {
        "$set": {"timetableObjectID": ObjectId(data["timetableObjectID"]), "generation": generation, "column_numbers": column_numbers, "fitness": fitness, "i": data["i"]}}, True)
    print(res.modified_count, res.upserted_id)

    return {"status": "done"}


def elitism_selection(data, percentage):
    my_list = []
    number_of_elements_to_select = int((percentage/100)*len(data))
    for k, v in data.items():
        my_list.append((k, v))
    elements_selected = sorted(my_list, key=lambda x: x[1], reverse=True)[
        0:number_of_elements_to_select]
    return_elements = []
    for element in elements_selected:
        return_elements.append(list(element[0]))
    return return_elements


def selection(data):
    sum_fittness = sum(data.values())
    partial = 0
    rand = random.randrange(0, int(sum_fittness))
    # print(rand)
    for k, v in data.items():
        # print(k)
        partial = partial+v
        if (partial >= rand):
            return list(k)


def mutation(chromosome, n):
    numbers = {}
    index_of_duplicates = []
    for i in range(n):
        numbers[i] = 0
    for i in range(len(chromosome)):
        if numbers[chromosome[i]] == 0:
            numbers[chromosome[i]] = 1
        elif numbers[chromosome[i]] == 1:
            index_of_duplicates.append(i)
    list_of_numbers_not_included = []
    for key, value in numbers.items():
        if value == 0:
            list_of_numbers_not_included.append(key)

    for index in index_of_duplicates:
        chromosome[index] = list_of_numbers_not_included.pop()
    return chromosome


def crossover(parent1, parent2):
    length = len(parent1)
    crosspoint1 = random.randrange(1, length-1)
    crosspoint2 = random.randrange(crosspoint1+1, length)
    child1 = parent1[0:crosspoint1] + \
        parent2[crosspoint1:crosspoint2]+parent1[crosspoint2:length]
    child2 = parent2[0:crosspoint1] + \
        parent1[crosspoint1:crosspoint2]+parent2[crosspoint2:length]
    return child1, child2


def geneticAlgorithm(prev_population, number_of_population):
    new_population = elitism_selection(prev_population, 10).copy()
    while len(new_population) < number_of_population:
        parent1 = selection(prev_population)
        parent2 = selection(prev_population)
        child1, child2 = crossover(parent1, parent2)
        child1 = mutation(child1, len(child1))
        child2 = mutation(child2, len(child2))
        if child1 not in new_population:
            new_population.append(child1)
        if child2 not in new_population:
            new_population.append(child2)
    return new_population


@app.route("/genetic_algorithm", methods=["POST"])
def create_new_population():
    data = request.get_json()
    # data={
    #   "generation":1,
    #   "userid":"5e9171b3f30119b6091a2a8f"
    #   "timetableObjectID":"5e91c6a3e9b32df71a4808e4"}
    print("This has come for genetic", data)
    generation = data["generation"]
    timetableObjectID = data["timetableObjectID"]

    res = mongo.db.chromosome_to_fitness.find(
        {"generation": generation, "timetableObjectID": ObjectId(timetableObjectID)})
    chromosome_to_fitness_dictionary = {}
    for x in res:
        chromosome_to_fitness_dictionary[tuple(
            x["column_numbers"])] = x["fitness"]

    res = mongo.db.user_timetables.find_one(
        {"_id": ObjectId(timetableObjectID)})
    print(chromosome_to_fitness_dictionary)
    population_size = res["data"]["population_size"]
    chart_data = res["chart_data"]
    new_population = geneticAlgorithm(
        chromosome_to_fitness_dictionary, population_size)

    summation = 0
    maximum = 0
    minimum = 100
    for i in chromosome_to_fitness_dictionary.values():
        if i > maximum:
            maximum = i
        if i < minimum:
            minimum = i
        summation += i
    average = summation/len(chromosome_to_fitness_dictionary)
    chart_data.append([generation, maximum, average, minimum])
    res = mongo.db.user_timetables.update_one({"_id": ObjectId(timetableObjectID)}, {
                                              "$set": {"generation": generation+1, "population": new_population, "chart_data": chart_data}})

    print(new_population)

    return {"new_population": new_population, "maximum": maximum, "minimum": minimum, "average": average}


@app.route("/save_maximum", methods=["POST"])
def save_maximum():
    data = request.get_json()
    # data = {
    #   "generation_with_maximum":10
    #   "timetableObjectID":"5e91c6a3e9b32df71a4808e4"
    # }

    generation_with_maximum = data["generation_with_maximum"]
    timetableObjectID = data["timetableObjectID"]

    res = mongo.db.chromosome_to_fitness.find(
        {"generation": generation_with_maximum, "timetableObjectID": ObjectId(timetableObjectID)})

    maximum = 0
    maximum_chromosome = ""
    i = 0
    for x in res:
        if maximum < x["fitness"]:
            maximum = x["fitness"]
            maximum_chromosome = x["column_numbers"]
            i = x["i"]

    print(maximum_chromosome)
    result = mongo.db.user_timetables.find_one(
        {"_id": ObjectId(timetableObjectID)})
    no_of_days = result["no_of_days"]
    no_of_hours = result["no_of_hours"]
    day_dictionary = pickle.loads(result["day_dictionary"])
    hour_dictionary = pickle.loads(result["hour_dictionary"])
    room_dictionary = pickle.loads(result["room_dictionary"])
    lecturer_dictionary = pickle.loads(result["lecturer_dictionary"])
    student_group_dictionary = pickle.loads(result["student_group_dictionary"])
    course_dictionary = pickle.loads(result["course_dictionary"])
    columns = pickle.loads(result["columns"])
    hours_for_columns = pickle.loads(result["hours_for_columns"])
    rows = pickle.loads(result["rows"])
    rows_invert = pickle.loads(result["rows_invert"])
    color_for_columns = result["color_for_columns"]

    target_matrix_template = np.zeros((len(rows), len(columns)))
    for i in range(len(rows)):
        if not hour_dictionary[rows[i]["hour"]].status:
            for j in range(len(columns)):
                target_matrix_template[i][j] = -1
    target_matrix, fitness = fillTargetMatrix(target_matrix_template, maximum_chromosome, columns, hours_for_columns, rows, rows_invert, day_dictionary,
                                              hour_dictionary, room_dictionary, lecturer_dictionary, student_group_dictionary, course_dictionary, no_of_days, no_of_hours, total_hours=210)

    res = mongo.db.target_matrix.update_one({"timetableObjectID": ObjectId(timetableObjectID)}, {
                                            "$set": {"target_matrix": Binary(pickle.dumps(target_matrix))}}, True)

    res = mongo.db.user_timetables.update_one({"_id": ObjectId(data["timetableObjectID"])}, {
        "$set": {"generation_with_maximum": data["generation_with_maximum"], "maximum_chromosome": maximum_chromosome, "i": i, "current": "timetable"}})
    return {"status": "done"}


@app.route("/get_performance", methods=["POST"])
def get_performance():
    data = request.get_json()
    generation = data["generation"]
    timetableObjectID = data["timetableObjectID"]
    res = mongo.db.chromosome_to_fitness.find(
        {"generation": generation, "timetableObjectID": ObjectId(timetableObjectID)})
    chromosome_to_fitness_dictionary = {}
    for x in res:
        print(x)
        chromosome_to_fitness_dictionary[tuple(
            x["column_numbers"])] = x["fitness"]
    summation = 0
    maximum = 0
    minimum = 100
    for i in chromosome_to_fitness_dictionary.values():
        if i > maximum:
            maximum = i
        if i < minimum:
            minimum = i
        summation += i
    average = summation/len(chromosome_to_fitness_dictionary)

    return {"maximum": maximum, "minimum": minimum, "average": average}


@app.route("/get_chromosome_with_maximum", methods=["POST"])
def get_chromosome_with_maximum():
    data = request.get_json()
    # data={
    #   "generation":1,
    #   "timetableObjectID":"5e91c6a3e9b32df71a4808e4"}
    generation = data["generation"]
    timetableObjectID = data["timetableObjectID"]

    res = mongo.db.chromosome_to_fitness.find(
        {"generation": generation, "timetableObjectID": timetableObjectID})

    chromosome_to_fitness_dictionary = pickle.loads(res["value"])

    maximum = 0
    for i in chromosome_to_fitness_dictionary:
        if maximum < chromosome_to_fitness_dictionary[i]:
            maximum = chromosome_to_fitness_dictionary[i]
            maximum_chromosome = i

    return {"chromosome": str(maximum_chromosome)}


# def make_html_timetable(rows, columns, className, classId, target_matrix, no_of_days, no_of_hours, course_dictionary, lecturer_dictionary, room_dictionary, hour_dictionary, day_dictionary):
#     lectures = []
#     for i in range(len(rows)):
#         for j in range(len(columns)):
#             if className == "room":
#                 if rows[i]["room"] == classId and target_matrix[i][j] == 1:
#                     lectures.append((i, j))
#             else:
#                 if columns[j][className] == classId and target_matrix[i][j] == 1:
#                     lectures.append((i, j))

#     slots = {}
#     for i in range(no_of_days):
#         for j in range(no_of_hours):
#             slots[(i, j)] = []

#     for i, j in lectures:
#         slots[(rows[i]["day"], rows[i]["hour"])].append((rows[i], columns[j]))

#     html_slots = {}
#     for key, val in slots.items():
#         temp_list = []
#         try:
#             val = sorted(val, key=lambda item: item[1]["batch"])
#         except:
#             pass
#         for item in val:
#             if item[1]["subset"] == "all":
#                 temp_list.append(course_dictionary[item[1]["course"]].name + " " +
#                                  lecturer_dictionary[item[1]["lecturer"]].name+" " + room_dictionary[item[0]["room"]].name)
#             else:
#                 temp_list.append(course_dictionary[item[1]["course"]].name + " " + lecturer_dictionary[item[1]
#                                                                                                        ["lecturer"]].name+" " + room_dictionary[item[0]["room"]].name + " "+item[1]["batch"])
#         if len(temp_list) == 0:
#             temp_list.append("")
#         html_slots[key] = temp_list
#     html_page = '''
#       <table style="margin:5%">
#       <style type="text/css">
#       table,
#       th,
#       td {
#         border: 3px solid #ff2e63;
#       }
#     </style>
#       <tr>
#             <th>
#               Day
#             </th>
#     '''
#     for j in range(no_of_hours):
#         html_page += "<th>"+hour_dictionary[j].name+"</th>"
#     html_page += "</tr>"
#     for i in range(no_of_days):
#         html_page += "<tr><td>"+day_dictionary[i].name+"</td>"
#         count = 1
#         for j in range(no_of_hours):
#             items = html_slots[(i, j)]
#             if len(items) == 1:
#                 html_page += "<td>" + items[0]+"</td>"
#             else:
#                 if j+1 != no_of_hours:
#                     if html_slots[(i, j)] == html_slots[(i, j+1)]:
#                         count += 1
#                     else:
#                         html_page += "<td colspan=" + \
#                             str(count)+">"+"<table style=\"width: 100%;\">"
#                         for item in items:
#                             html_page += "<tr><td>" + item + "</td></tr>"
#                         html_page += "</table></td>"
#                         count = 1
#                 else:
#                     html_page += "<td colspan=" + \
#                         str(count)+">"+"<table style=\"width: 100%;\">"
#                     for item in items:
#                         html_page += "<tr><td>" + item + "</td></tr>"
#                     html_page += "</table></td>"
#                     count = 1
#         html_page += "</tr>"
#     html_page += "</table>"
#     return html_page


# @app.route("/get_timetable", methods=["POST"])
# def get_timetable():
#     data = request.get_json()
#     # data={
#     #   "generation":1,
#     #   "timetableObjectID":"5e91c6a3e9b32df71a4808e4",
#     #   "chromosome":String,
#     #   "className":,
#     #   "classId":}
#     print(data)
#     result = mongo.db.user_timetables.find_one(
#         {"_id": ObjectId(data["timetableObjectID"])})
#     no_of_days = result["no_of_days"]
#     no_of_hours = result["no_of_hours"]
#     day_dictionary = pickle.loads(result["day_dictionary"])
#     hour_dictionary = pickle.loads(result["hour_dictionary"])
#     room_dictionary = pickle.loads(result["room_dictionary"])
#     lecturer_dictionary = pickle.loads(result["lecturer_dictionary"])
#     student_group_dictionary = pickle.loads(result["student_group_dictionary"])
#     course_dictionary = pickle.loads(result["course_dictionary"])
#     columns = pickle.loads(result["columns"])
#     hours_for_columns = pickle.loads(result["hours_for_columns"])
#     rows = pickle.loads(result["rows"])
#     generation = data["generation"]
#     chromosome = ast.literal_eval(data["chromosome"])
#     className = data["className"]
#     classId = data["classId"]

#     result = mongo.db.chromosome_to_target_matrix.find_one(
#         {"timetableObjectID": ObjectId(data["timetableObjectID"]), "generation": generation_with_maximum, "column_numbers": maximum_chromosome, "i": i})
#     target_matrix = pickle.loads(result["target_matrix"])

#     if className == "lecturer":
#         for key, value in lecturer_dictionary.items():
#             if value.name == classId:
#                 classId = key
#                 break

#     elif className == "student_group":
#         for key, value in student_group_dictionary.items():
#             if value.name == classId:
#                 classId = key
#                 break

#     elif className == "room":
#         for key, value in room_dictionary.items():
#             if value.name == classId:
#                 classId = key
#                 break

#     page = make_html_timetable(rows, columns, className, classId, target_matrix, no_of_days, no_of_hours,
#                                course_dictionary, lecturer_dictionary, room_dictionary, hour_dictionary, day_dictionary)

#     return page


def name(s):
    new = s.split(" ")
    return new[0]


def getTableData(target_matrix, color_for_columns, rows, hours_for_columns, columns, course_dictionary, student_group_dictionary, lecturer_dictionary, room_dictionary, hour_dictionary,
                 day_dictionary, no_of_hours, no_of_days, i, generation_with_maximum, maximum_chromosome):
    student_group_id_list = []
    student_group_slots = {}
    student_group_slot_array = {}
    data = {"student_groups": []}
    for key, value in student_group_dictionary.items():
        student_group_id_list.append(key)
        data["student_groups"].append(value.name)
        student_group_slots[key] = {}
        student_group_slot_array[key] = []

    for i in range(len(rows)):
        for j in range(len(columns)):
            if target_matrix[i][j] == 1:
                if str(rows[i]["day"])+" "+str(rows[i]["hour"]) in student_group_slots[columns[j]["student_group"]]:
                    student_group_slots[columns[j]["student_group"]][str(rows[i]["day"])+" "+str(rows[i]["hour"])].append({"slot": course_dictionary[columns[j]["course"]].id+" "+name(
                        lecturer_dictionary[columns[j]["lecturer"]].name)+" "+room_dictionary[rows[i]["room"]].name+(" "+columns[j]["subset"].capitalize()+" "+columns[j]["batch"] if columns[j]["subset"] != "all" else ""), "color": color_for_columns[str(columns[j])], "row_number": i, "column_number": j, "day": rows[i]["day"], "hour": rows[i]["hour"]})
                    student_group_slots[columns[j]["student_group"]][str(
                        rows[i]["day"])+" "+str(rows[i]["hour"])].sort(key=lambda x: x["slot"].split(" ")[-1])
                else:
                    student_group_slots[columns[j]["student_group"]][str(rows[i]["day"])+" "+str(rows[i]["hour"])] = [{"slot": course_dictionary[columns[j]["course"]].id+" "+name(
                        lecturer_dictionary[columns[j]["lecturer"]].name)+" "+room_dictionary[rows[i]["room"]].name+(" "+columns[j]["subset"].capitalize()+" "+columns[j]["batch"] if columns[j]["subset"] != "all" else ""), "color": color_for_columns[str(columns[j])], "row_number": i, "column_number": j, "day": rows[i]["day"], "hour": rows[i]["hour"]}]

    for s in student_group_slots:
        for i in range(no_of_days):
            for j in range(no_of_hours):
                if str(i)+" "+str(j) in student_group_slots[s]:
                    student_group_slot_array[s].append(
                        student_group_slots[s][str(i)+" "+str(j)])
                else:
                    student_group_slot_array[s].append(
                        [{"slot": "Free", "color": "#fff", "day": i, "hour": j}])
    table_data = []
    for i in range(no_of_days):
        for j in range(no_of_hours):
            if j == 0:
                temp = [{"iterable": day_dictionary[i].name, "item": "day"}, {
                    "iterable": hour_dictionary[j].name, "item": "slot"}]
                for s in student_group_id_list:
                    temp.append(
                        {"iterable": student_group_slot_array[s][i*no_of_hours+j], "item": "table"})
                table_data.append(temp)
            else:
                temp = [{"iterable": hour_dictionary[j].name, "item": "slot"}]
                for s in student_group_id_list:
                    temp.append(
                        {"iterable": student_group_slot_array[s][i*no_of_hours+j], "table": "table"})
                table_data.append(temp)

    slots_left_to_schedule = []
    for j in range(len(columns)):
        summation = 0
        for i in range(len(rows)):
            if target_matrix[i][j] == 1:
                summation += 1
        slots_left_to_schedule.append({"slot": columns[j]["course"] + " "+name(lecturer_dictionary[columns[j]["lecturer"]].name)+" "+(" "+columns[j]["subset"].capitalize()+" "+columns[j]["batch"] if columns[j]["subset"] != "all" else ""),
                                       "color": color_for_columns[str(columns[j])],
                                       "available": hours_for_columns[j] - summation,
                                       "column_number": j})

    slots_left_to_schedule.sort(reverse=True, key=lambda x: x["available"])
    slots_left_to_schedule = list(filter(
        lambda x: x["available"] > 0, slots_left_to_schedule))
    data["table_data"] = table_data
    data["no_of_hours"] = no_of_hours
    data["slots_left_to_schedule"] = slots_left_to_schedule
    data["rooms"] = [{"id": x, "name": y.name, "selected": False}
                     for x, y in room_dictionary.items()]
    return data


@app.route("/get_complete_timetable", methods=["POST"])
def get_complete_timetable():
    data = request.get_json()
    # data = {
    # "timetableObjectID":5e92d1c853a18ace9dacfd5d
    # }

    timetableObjectID = data["timetableObjectID"]

    result = mongo.db.user_timetables.find_one(
        {"_id": ObjectId(timetableObjectID)})
    maximum_chromosome = result["maximum_chromosome"]
    generation_with_maximum = result["generation_with_maximum"]
    i = result["i"]
    no_of_days = result["no_of_days"]
    no_of_hours = result["no_of_hours"]
    day_dictionary = pickle.loads(result["day_dictionary"])
    hour_dictionary = pickle.loads(result["hour_dictionary"])
    room_dictionary = pickle.loads(result["room_dictionary"])
    lecturer_dictionary = pickle.loads(result["lecturer_dictionary"])
    student_group_dictionary = pickle.loads(result["student_group_dictionary"])
    course_dictionary = pickle.loads(result["course_dictionary"])
    columns = pickle.loads(result["columns"])
    hours_for_columns = pickle.loads(result["hours_for_columns"])
    rows = pickle.loads(result["rows"])
    rows_invert = pickle.loads(result["rows_invert"])
    color_for_columns = result["color_for_columns"]
    print(color_for_columns)

    res = mongo.db.target_matrix.find_one(
        {"timetableObjectID": ObjectId(timetableObjectID)})
    target_matrix = pickle.loads(res["target_matrix"])

    # res = mongo.db.chromosome_to_target_matrix.find_one(
    #     {"timetableObjectID": ObjectId(timetableObjectID), "generation": generation_with_maximum, "column_numbers": maximum_chromosome, "i": i})

    data = getTableData(target_matrix, color_for_columns, rows, hours_for_columns, columns, course_dictionary, student_group_dictionary, lecturer_dictionary,
                        room_dictionary, hour_dictionary, day_dictionary, no_of_hours, no_of_days, i, generation_with_maximum, maximum_chromosome)

    return data


# def removeSlot(remove_data, rows, columns, target_matrix, timetableObjectID, maximum_chromosome, generation_with_maximum, iteration):
#     day = rows[remove_data["row_number"]]["day"]
#     hour = rows[remove_data["row_number"]]["hour"]
#     lecturer_id = columns[remove_data["column_number"]]["lecturer"]
#     student_group_id = columns[remove_data["column_number"]]["student_group"]
#     subset = columns[remove_data["column_number"]]["subset"]

#     target_matrix[remove_data["row_number"]][remove_data["column_number"]] = 0

#     row_validity_flag = []

#     for i in range(len(rows)):
#         flag = True
#         for j in range(len(columns)):
#             if target_matrix[i][j] == 1:
#                 flag = False
#                 break
#         row_validity_flag.append(flag)

#     if subset == "all":
#         for j in range(len(columns)):
#             if target_matrix[remove_data["row_number"]][j] == 1:
#                 print(1, j)
#             target_matrix[remove_data["row_number"]][j] = 0
#         if row_validity_flag[i]:
#             for i in range(len(rows)):
#                 for j in range(len(columns)):
#                     if rows[i]["day"] == day and rows[i]["hour"] == hour and columns[j]["lecturer"] == lecturer_id:
#                         if target_matrix[i][j] == 1:
#                             print(2, i, j)
#                         target_matrix[i][j] = 0
#                     if rows[i]["day"] == day and rows[i]["hour"] == hour and columns[j]["student_group"] == student_group_id:
#                         if target_matrix[i][j] == 1:
#                             print(2, i, j)
#                         target_matrix[i][j] = 0

#     else:
#         batch = columns[remove_data["column_number"]]["batch"]
#         for j in range(len(columns)):
#             if target_matrix[remove_data["row_number"]][j] == 1:
#                 print(1, j)
#             target_matrix[remove_data["row_number"]][j] = 0

#         for i in range(len(rows)):
#             if row_validity_flag[i]:
#                 for j in range(len(columns)):
#                     if rows[i]["day"] == day and rows[i]["hour"] == hour and columns[j]["lecturer"] == lecturer_id:
#                         # if target_matrix[i][j] == 1:
#                         print(2, i, j)
#                         target_matrix[i][j] = 0
#                     if rows[i]["day"] == day and rows[i]["hour"] == hour and columns[j]["student_group"] == student_group_id and columns[j]["subset"] != subset:
#                         # if target_matrix[i][j] == 1:
#                         print(3, i, j)
#                         target_matrix[i][j] = 0
#                     if rows[i]["day"] == day and rows[i]["hour"] == hour and columns[j]["student_group"] == student_group_id and columns[j]["subset"] == subset and columns[j]["batch"] == batch:
#                         # if target_matrix[i][j] == 1:
#                         print(4, i, j)
#                         target_matrix[i][j] = 0

#     return target_matrix

def removeSlot(remove_data, target_matrix):
    target_matrix[remove_data["row_number"]][remove_data["column_number"]] = 0
    return target_matrix


@app.route("/remove_slot", methods=["POST"])
def remove_slot():
    # data = {
    # "timetableObjectID":5e92d1c853a18ace9dacfd5d,
    # "row_number":
    # "column_number":
    # }

    data = request.get_json()
    timetableObjectID = data["timetableObjectID"]

    result = mongo.db.user_timetables.find_one(
        {"_id": ObjectId(timetableObjectID)})
    maximum_chromosome = result["maximum_chromosome"]
    generation_with_maximum = result["generation_with_maximum"]
    i = result["i"]
    print(timetableObjectID, maximum_chromosome, generation_with_maximum, i)
    no_of_days = result["no_of_days"]
    no_of_hours = result["no_of_hours"]
    day_dictionary = pickle.loads(result["day_dictionary"])
    hour_dictionary = pickle.loads(result["hour_dictionary"])
    room_dictionary = pickle.loads(result["room_dictionary"])
    lecturer_dictionary = pickle.loads(result["lecturer_dictionary"])
    student_group_dictionary = pickle.loads(result["student_group_dictionary"])
    course_dictionary = pickle.loads(result["course_dictionary"])
    columns = pickle.loads(result["columns"])
    hours_for_columns = pickle.loads(result["hours_for_columns"])
    rows = pickle.loads(result["rows"])
    color_for_columns = result["color_for_columns"]

    res = mongo.db.target_matrix.find_one(
        {"timetableObjectID": ObjectId(timetableObjectID)})
    target_matrix = pickle.loads(res["target_matrix"])

    target_matrix = pickle.loads(res["target_matrix"])

    for slot in data["slots"]:
        target_matrix = removeSlot(slot, target_matrix)

        # row_number = data["row_number"]
        # column_number = data["column_number"]
        # print(data)
        # remove_data = {"row_number": row_number, "column_number": column_number}

    # target_matrix = removeSlot(remove_data, rows, columns, target_matrix,
    #                            timetableObjectID, maximum_chromosome, generation_with_maximum, i)

    res = mongo.db.target_matrix.update_one({"timetableObjectID": ObjectId(timetableObjectID)}, {
                                            "$set": {"target_matrix": Binary(pickle.dumps(target_matrix))}}, True)

    data = getTableData(target_matrix, color_for_columns, rows, hours_for_columns, columns, course_dictionary, student_group_dictionary, lecturer_dictionary,
                        room_dictionary, hour_dictionary, day_dictionary, no_of_hours, no_of_days, i, generation_with_maximum, maximum_chromosome)

    return data


# def addSlot(add_data, columns, rows, room_dictionary, course_dictionary, target_matrix):
#     # add_data = {"column_number": 67, "day": 0, "hour": 0}
#     column_number = add_data["column_number"]
#     day = add_data["day"]
#     hour = add_data["hour"]
#     lecturer_id = columns[add_data["column_number"]]["lecturer"]
#     student_group_id = columns[add_data["column_number"]]["student_group"]
#     course = columns[add_data["column_number"]]["course"]
#     subset = columns[add_data["column_number"]]["subset"]
#     scheduled = False
#     if subset == "all":
#         print(day, hour, lecturer_id, student_group_id, course, subset)
#         for r in range(len(rows)):
#             if rows[r]["day"] == day and rows[r]["hour"] == hour and room_dictionary[rows[r]["room"]].name in course_dictionary[course].valid_rooms and target_matrix[r][column_number] == 0:
#                 for j in range(len(columns)):
#                     if target_matrix[r][j] == 1:
#                         print(1, j)
#                     target_matrix[r][j] = -1

#                 for i in range(len(rows)):
#                     for j in range(len(columns)):
#                         if rows[i]["day"] == day and rows[i]["hour"] == hour and columns[j]["lecturer"] == lecturer_id:
#                             if target_matrix[i][j] == 1:
#                                 print(2, i, j)
#                             target_matrix[i][j] = -1
#                         if rows[i]["day"] == day and rows[i]["hour"] == hour and columns[j]["student_group"] == student_group_id:
#                             if target_matrix[i][j] == 1:
#                                 print(3, i, j)
#                             target_matrix[i][j] = -1

#                 target_matrix[r][column_number] = 1
#                 scheduled = True
#                 break
#     else:
#         batch = columns[add_data["column_number"]]["batch"]
#         print(day, hour, lecturer_id, student_group_id, course, subset, batch)
#         for r in range(len(rows)):
#             if rows[r]["day"] == day and rows[r]["hour"] == hour and room_dictionary[rows[r]["room"]].name in course_dictionary[course].valid_rooms and target_matrix[r][column_number] == 0:
#                 # Schedule Here
#                 print(day, hour, room_dictionary[rows[r]["room"]].name)
#                 for j in range(len(columns)):
#                     if target_matrix[r][j] == 1:
#                         print(1, j)
#                     target_matrix[r][j] = -1
#                 for i in range(len(rows)):
#                     for j in range(len(columns)):
#                         if rows[i]["day"] == day and rows[i]["hour"] == hour and columns[j]["lecturer"] == lecturer_id:
#                             if target_matrix[i][j] == 1:
#                                 print(2, i, j)
#                             target_matrix[i][j] = -1
#                         if rows[i]["day"] == day and rows[i]["hour"] == hour and columns[j]["student_group"] == student_group_id and columns[j]["subset"] != subset:
#                             if target_matrix[i][j] == 1:
#                                 print(3, i, j)
#                             target_matrix[i][j] = -1
#                         if rows[i]["day"] == day and rows[i]["hour"] == hour and columns[j]["student_group"] == student_group_id and columns[j]["subset"] == subset and columns[j]["batch"] == batch and target_matrix[i][j] != 1:
#                             if target_matrix[i][j] == 1:
#                                 print(4, i, j)
#                             target_matrix[i][j] = -1
#                 target_matrix[r][column_number] = 1
#                 scheduled = True
#                 break
#     return scheduled, target_matrix

def addSlot(add_data, target_matrix, rows, rows_invert, columns, room_dictionary, course_dictionary, valid_rooms):
    column_number = add_data["column_number"]
    day = add_data["day"]
    hour = add_data["hour"]
    lecturer_id = columns[add_data["column_number"]]["lecturer"]
    student_group_id = columns[add_data["column_number"]]["student_group"]
    course = columns[add_data["column_number"]]["course"]
    subset = columns[add_data["column_number"]]["subset"]
    print(day, hour, lecturer_id, student_group_id, course, subset)
    scheduled_flag = False
    if subset == "all":
        for room, obj in room_dictionary.items():
            for j in columns:
                if columns[j]["lecturer"] == lecturer_id:
                    if target_matrix[rows_invert[day][hour][room]][j] == 1:
                        scheduled_flag = True
                        print("Lecturer Unavailable")
                        print(day, hour, obj.name)
                        return False, target_matrix, "Lecturer Unavailable at Day: {} and Hour: {}".format(day+1, hour+1)
                elif columns[j]["student_group"] == student_group_id:
                    if target_matrix[rows_invert[day][hour][room]][j] == 1:
                        scheduled_flag = True
                        print("Student Group Unavailable")
                        print(day, hour, obj.name)
                        return False, target_matrix, "Student Group Unavailable at Day: {} and Hour: {}".format(day+1, hour+1)
    else:
        batch = columns[add_data["column_number"]]["batch"]
        for room, obj in room_dictionary.items():
            for j in columns:
                if columns[j]["lecturer"] == lecturer_id:
                    if target_matrix[rows_invert[day][hour][room]][j] == 1:
                        scheduled_flag = True
                        print("Lecturer Unavailable")
                        print(day, hour, obj.name)
                        return False, target_matrix, "Lecturer Unavailable at Day: {} and Hour: {}".format(day+1, hour+1)
                elif columns[j]["student_group"] == student_group_id and columns[j]["subset"] != subset:
                    if target_matrix[rows_invert[day][hour][room]][j] == 1:
                        scheduled_flag = True
                        print("Student Group Unavailable")
                        print(day, hour, obj.name)
                        return False, target_matrix, "Student Group Unavailable at Day: {} and Hour: {}".format(day+1, hour+1)
                elif columns[j]["student_group"] == student_group_id and columns[j]["subset"] == subset and columns[j]["batch"] == batch:
                    if target_matrix[rows_invert[day][hour][room]][j] == 1:
                        scheduled_flag = True
                        print("Batch Unavailable")
                        print(day, hour, obj.name)
                        return False, target_matrix, "Batch Unavailable at Day: {} and Hour: {}".format(day+1, hour+1)

    room_flag = True

    if not scheduled_flag:
        for room, obj in room_dictionary.items():
            if obj.name in valid_rooms:
                for j in range(len(columns)):
                    if target_matrix[rows_invert[day][hour][room]][j] == 1:
                        valid_rooms.remove(obj.name)

    print(valid_rooms)
    if len(valid_rooms) == 0:
        print("Room Unavailable")
        return False, target_matrix, "Rooms Unavailable at Day: {} and Hour: {}".format(day+1, hour+1)

    for room, obj in room_dictionary.items():
        if obj.name in valid_rooms:
            target_matrix[rows_invert[day][hour][room]][column_number] = 1
            return True, target_matrix, "Successfully Added!"


@app.route("/add_slot", methods=["POST"])
def add_slot():
    # data = {
    # "timetableObjectID":5e92d1c853a18ace9dacfd5d,
    # "column_number":
    # "day":,
    # "hour":
    # }
    data = request.get_json()
    timetableObjectID = data["timetableObjectID"]
    column_number = data["column_number"]
    day = data["day"]
    hour = data["hour"]
    print(data)
    add_data = {"column_number": column_number, "day": day, "hour": hour}

    result = mongo.db.user_timetables.find_one(
        {"_id": ObjectId(timetableObjectID)})
    maximum_chromosome = result["maximum_chromosome"]
    generation_with_maximum = result["generation_with_maximum"]
    iteration = result["i"]
    print(timetableObjectID, maximum_chromosome,
          generation_with_maximum, iteration)
    no_of_days = result["no_of_days"]
    no_of_hours = result["no_of_hours"]
    day_dictionary = pickle.loads(result["day_dictionary"])
    hour_dictionary = pickle.loads(result["hour_dictionary"])
    room_dictionary = pickle.loads(result["room_dictionary"])
    lecturer_dictionary = pickle.loads(result["lecturer_dictionary"])
    student_group_dictionary = pickle.loads(result["student_group_dictionary"])
    course_dictionary = pickle.loads(result["course_dictionary"])
    columns = pickle.loads(result["columns"])
    hours_for_columns = pickle.loads(result["hours_for_columns"])
    rows = pickle.loads(result["rows"])
    rows_invert = pickle.loads(result["rows_invert"])
    color_for_columns = result["color_for_columns"]

    res = mongo.db.target_matrix.find_one(
        {"timetableObjectID": ObjectId(timetableObjectID)})
    target_matrix = pickle.loads(res["target_matrix"])

    course = columns[add_data["column_number"]]["course"]
    valid_rooms = course_dictionary[course].valid_rooms.copy()

    scheduled, target_matrix, message = addSlot(
        add_data, target_matrix, rows, rows_invert, columns, room_dictionary, course_dictionary, valid_rooms)

    if scheduled:
        res = mongo.db.target_matrix.update_one({"timetableObjectID": ObjectId(timetableObjectID)}, {
            "$set": {"target_matrix": Binary(pickle.dumps(target_matrix))}}, True)

        data = getTableData(target_matrix, color_for_columns, rows, hours_for_columns, columns, course_dictionary, student_group_dictionary, lecturer_dictionary,
                            room_dictionary, hour_dictionary, day_dictionary, no_of_hours, no_of_days, iteration, generation_with_maximum, maximum_chromosome)

        data["status"] = "done"

        return data

    else:
        return {"status": "fail", "message": message}


@app.route("/change_room", methods=["POST"])
def change_room():
    # data = {
    # "timetableObjectID":5e92d1c853a18ace9dacfd5d,
    # "row_number":
    # "column_number":
    # }
    data = request.get_json()
    print(data)
    timetableObjectID = data["timetableObjectID"]
    result = mongo.db.user_timetables.find_one(
        {"_id": ObjectId(timetableObjectID)})
    rooms = [x["name"] for x in data["rooms"] if x["selected"]]
    maximum_chromosome = result["maximum_chromosome"]
    generation_with_maximum = result["generation_with_maximum"]
    iteration = result["i"]
    print(timetableObjectID, maximum_chromosome,
          generation_with_maximum, iteration)
    no_of_days = result["no_of_days"]
    no_of_hours = result["no_of_hours"]
    day_dictionary = pickle.loads(result["day_dictionary"])
    hour_dictionary = pickle.loads(result["hour_dictionary"])
    room_dictionary = pickle.loads(result["room_dictionary"])
    lecturer_dictionary = pickle.loads(result["lecturer_dictionary"])
    student_group_dictionary = pickle.loads(result["student_group_dictionary"])
    course_dictionary = pickle.loads(result["course_dictionary"])
    columns = pickle.loads(result["columns"])
    hours_for_columns = pickle.loads(result["hours_for_columns"])
    rows = pickle.loads(result["rows"])
    rows_invert = pickle.loads(result["rows_invert"])
    color_for_columns = result["color_for_columns"]

    res = mongo.db.target_matrix.find_one(
        {"timetableObjectID": ObjectId(timetableObjectID)})
    target_matrix = pickle.loads(res["target_matrix"])

    target_matrix = pickle.loads(res["target_matrix"])
    remove_data = {
        'column_number': data['column_number'], 'row_number': data['row_number']}

    # First Remove Slot
    target_matrix = removeSlot(remove_data, target_matrix)

    add_data = {"column_number": data['column_number'],
                "day": rows[data['row_number']]["day"], "hour": rows[data['row_number']]["hour"]}
    # Add in New Slot
    scheduled, target_matrix, message = addSlot(
        add_data, target_matrix, rows, rows_invert, columns, room_dictionary, course_dictionary, rooms)

    if scheduled:
        res = mongo.db.target_matrix.update_one({"timetableObjectID": ObjectId(timetableObjectID)}, {
            "$set": {"target_matrix": Binary(pickle.dumps(target_matrix))}}, True)

        data = getTableData(target_matrix, color_for_columns, rows, hours_for_columns, columns, course_dictionary, student_group_dictionary, lecturer_dictionary,
                            room_dictionary, hour_dictionary, day_dictionary, no_of_hours, no_of_days, iteration, generation_with_maximum, maximum_chromosome)

        data["status"] = "done"

        print(data)

        return data

    else:
        return {"status": "fail", "message": message}
