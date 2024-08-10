import React, { useEffect, useState } from "react";
import Layout from './../components/Layout';
import { useParams } from "react-router-dom";
import axios from "axios";
import { DatePicker, message, TimePicker } from "antd";
import moment from "moment";
import { useDispatch, useSelector } from "react-redux";
import { showLoading, hideLoading } from "../redux/features/alertSlice";

const BookingPage = () => {
    const { user } = useSelector((state) => state.user);
    const params = useParams();
    const [doctors, setDoctors] = useState([]);
    const [date, setDate] = useState("");
    const [time, setTime] = useState();
    const [isAvailable, setIsAvailable] = useState(false);
    const dispatch = useDispatch();

    //login user data
    const getUserData = async () => {
        try {
            const res = await axios.post(
                "/api/v1/doctor/getDoctorById",
                { doctorId: params.doctorId },
                {
                  headers: {
                    Authorization: "Bearer " + localStorage.getItem("token"),
                  },
                }
            );
            if(res.data.success) {
                setDoctors(res.data.data);
            }
        } catch (error) {
            console.log(error);
        }
    };

    // =============== booking function
    const handleBooking = async () => {
        try {
            dispatch(showLoading());
            const res = await axios.post(
              "/api/v1/user/book-appointment",
              {
                doctorId: params.doctorId,
                userId: user._id,
                doctorInfo: doctors,
                userInfo: user,
                date: date,
                time: time,
              },
              {
                headers: {
                    Authorization: `Bearer ${localStorage.getItem("token")}`,
                },
              }
            );
            dispatch(hideLoading());
            if (res.data.success) {
                message.success(res.data.message);
            }
        } catch (error) {
            dispatch(hideLoading());
            console.log(error);
        }
    };

    useEffect(() => {
        getUserData();
        //eslint-disable-next-line
    }, []);

  return (
    <Layout>
        <h3>Booking Page</h3>
        <div className="container m-2">
          {doctors && (
            <div>
              <h4>Dr.{doctors.firstName} {doctors.lastName}</h4>
              <h4>Fees : {doctors.feesPerCunsaltation}</h4>
              <h4>
                Timings : {doctors.timings && doctors.timings[0]} -{" "}
                {doctors.timings && doctors.timings[1]}{" "}
              </h4>
              <div className="d-flex flex-column w-50">
                <DatePicker 
                  className="m-2"
                  format="DD-MM-YYYY"
                  onChange={(value) => 
                    setDate(moment(value).format("DD-MM-YYYY"))
                  } 
                />
                <TimePicker
                  format="HH:mm"
                  className="m-2"
                  onChange={(value) => {
                    setTime(moment(value).format("HH:mm"));
                  }}
                />
                <button className="btn btn-primary mt-2">
                    Check Availability
                </button>
                <button className="btn btn-dark mt-2" onClick={handleBooking}>
                    Book Now
                </button>
              </div>
            </div>
          )}
        </div>
    </Layout>
  );
};

export default BookingPage;