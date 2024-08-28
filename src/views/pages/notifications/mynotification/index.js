import React, { useContext, useEffect, useState } from "react";
import Table from "./Datatables";
import "@styles/react/pages/page-authentication.scss";
import { apiRequest } from "../../../../utility/apiRequest";
import LoadingContext from "../../../../utility/context/LoadingContext";
import toast from "react-hot-toast";

const MyNotifications = ({ teacherInfo }) => {
  const { setLoading } = useContext(LoadingContext);
  const [notificationsList, setNotificationsList] = useState([]);
  useEffect(() => {
    getNotifications();
  }, []);

  const getNotifications = async () => {
    const resp = await apiRequest._getUserNotifications(teacherInfo.userID);
    if (resp.status) {
      setNotificationsList(resp.data);
    }
  };

  const onDelete = async (id, onSuccess) => {
    setLoading(true);
    const resp = await apiRequest._deleteUserNotifications(
      teacherInfo.userID,
      id
    );
    onSuccess();
    setLoading(false);
    if (resp.status) {
      getNotifications();
      toast.success(resp.message);
    } else {
      toast.error(resp.message);
    }
  };
  return (
    <div className="card">
      <div className="card-body filterheader">
        <Table data={notificationsList} onDelete={onDelete} />
      </div>
    </div>
  );
};
export default MyNotifications;
