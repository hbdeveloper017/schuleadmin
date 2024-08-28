import axios from "axios";
import useJwt from "@src/auth/jwt/useJwt";

const API_BASE_URL = "http://3.95.241.234:3001";

// The code block initializes an Axios instance for the API service.
// The baseURL is set to API_BASE_URL, the timeout is set to 10000 milliseconds, and the headers object is used to specify the content type for the HTTP requests.
// This configuration ensures that all requests made using this Axios instance will have a consistent base URL and content type, making it easier to manage and maintain the API service.
const apiService = axios.create({
  baseURL: API_BASE_URL,
  timeout: 20000,
  headers: {
    // "Content-Type": "application/json",
    "Content-Type": "application/x-www-form-urlencoded",
    Accept: "application/json",
  },
});

// The apiService.interceptors.request.use(async config => { ... }) code block sets up an Axios request interceptor to add an authorization token to outgoing requests.
// The getAuthToken() function is called to retrieve the token, which is then added to the request headers if it exists.
// This interceptor is useful for ensuring that all requests made by the application are authenticated and authorized.
// The use of async and await ensures that the token is retrieved before the request is sent.
apiService.interceptors.request.use(async (config) => {
  try {
    let token = await localStorage.getItem("accessToken");

    if (token) {
      config.headers.Authorization = `Bearer ${JSON.parse(token)}`;
    }

    return config;
  } catch (error) {
    console.error("Interceptor Error:", error);
    return Promise.reject(error);
  }
});

const apiRequest = {
  _editProfile: async (data) => {
    try {
      const response = await apiService.put("/admin/profile", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _editPassword: async (data) => {
    try {
      const response = await apiService.put("/admin/update-password", data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getSubjects: async () => {
    try {
      const response = await apiService.get("/admin/subjects");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _addSubject: async (data) => {
    try {
      const response = await apiService.post("/admin/subject", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _updateSubject: async (subjectID, data) => {
    try {
      const response = await apiService.put(
        `/admin/subject/${subjectID}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteSubject: async (subjectID) => {
    try {
      const response = await apiService.delete(`/admin/subject/${subjectID}`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getSchool: async () => {
    try {
      const response = await apiService.get("/admin/schools");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _addSchool: async (data) => {
    try {
      const response = await apiService.post("/admin/school", data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _updateSchool: async (schoolID, data) => {
    try {
      const response = await apiService.put(`/admin/school/${schoolID}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteSchool: async (schoolID) => {
    try {
      const response = await apiService.delete(`/admin/school/${schoolID}`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getGrades: async () => {
    try {
      const response = await apiService.get("/admin/grades");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getActiveUsers: async () => {
    try {
      const response = await apiService.get("/admin/active-users");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getNotifications: async () => {
    try {
      const response = await apiService.get("/admin/announcements");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getReoprts: async () => {
    try {
      const response = await apiService.get("/admin/reports");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getTeachers: async () => {
    try {
      const response = await apiService.get("/admin/teacher-assign");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _addAllotStudent: async (userID, data) => {
    try {
      const response = await apiService.post(
        `/admin/user/${userID}/allot`,
        data
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _addRespondReport: async (data) => {
    try {
      const response = await apiService.post(`/admin/respond-to-report`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _updateReportStatus: async (data) => {
    try {
      const response = await apiService.put(`/admin/respond-to-report`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _addNotification: async (data) => {
    try {
      const response = await apiService.post(`/admin/announcement`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteNotification: async (id) => {
    try {
      const response = await apiService.delete(`/admin/announcement/${id}`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteAllotStudent: async (teacherId, studentId) => {
    try {
      const response = await apiService.delete(
        `/admin/user/${teacherId}/remove-allotted-student/${studentId}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _addGrade: async (data) => {
    try {
      const response = await apiService.post(`/admin/grade`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _updateGrade: async (gradeID, data) => {
    try {
      const response = await apiService.put(`/admin/grade/${gradeID}`, data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteGrade: async (gradeID) => {
    try {
      const response = await apiService.delete(`/admin/grade/${gradeID}`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getBadWords: async () => {
    try {
      const response = await apiService.get("/admin/bad-words");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _addBadWord: async (data) => {
    try {
      const response = await apiService.post("/admin/bad-word", data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _updateBadWord: async (badWordID, data) => {
    try {
      const response = await apiService.put(
        `/admin/bad-word/${badWordID}`,
        data
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteBadWord: async (badWordID) => {
    try {
      const response = await apiService.delete(`/admin/bad-word/${badWordID}`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getCmsPages: async () => {
    try {
      const response = await apiService.get("/admin/cms-pages");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _updateCmsPages: async (cmsPageID, data) => {
    try {
      const response = await apiService.put(
        `/admin/cms-page/${cmsPageID}`,
        data
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getSuggestions: async (data) => {
    try {
      const response = await apiService.get("/admin/suggestions", {
        params: data,
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteSuggestions: async (suggestionID) => {
    try {
      const response = await apiService.delete(
        `/admin/suggestion/${suggestionID}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getUserList: async (data) => {
    try {
      const response = await apiService.get("/admin/users", {
        params: data,
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getReferral: async (userID) => {
    try {
      const response = await apiService.get(`/admin/user/${userID}/referrals`);

      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getAssignStudents: async (userID) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/student-for-assign`
      );

      return response.data;
    } catch (error) {
      return error;
    }
  },
  _userApprove: async (data) => {
    try {
      const response = await apiService.post("/admin/user-approve", data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _userReject: async (data) => {
    try {
      const response = await apiService.post("/admin/user-reject", data);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getDocuments: async (userID, role) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/documents?role=${role}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getGroups: async (userID) => {
    try {
      const response = await apiService.get(`/admin/user/${userID}/groups`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _updateGroup: async (userID, groupID, data) => {
    try {
      const response = await apiService.put(
        `/admin/user/${userID}/group/${groupID}`,
        data
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getUserAssignedStudents: async (userID) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/assigned-students`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getUserNotifications: async (userID) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/announcements`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteUserNotifications: async (userID, announcementID) => {
    try {
      const response = await apiService.delete(
        `/admin/user/${userID}/announcement/${announcementID}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteDocument: async (userID, documentID) => {
    try {
      const response = await apiService.delete(
        `/admin/user/${userID}/document/${documentID}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getStateList: async () => {
    try {
      const response = await apiService.get("/admin/states");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getUserClasswork: async (userID) => {
    try {
      const response = await apiService.get(`/admin/user/${userID}/class-work`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteClasswork: async (userID, subjectID) => {
    try {
      const response = await apiService.delete(
        `/admin/user/${userID}/class-work/${subjectID}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getUserClassworkDetails: async (userID, subjectID) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/class-work/${subjectID}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteClassworkDocument: async (userID, subjectID, classWorkID) => {
    try {
      const response = await apiService.delete(
        `/admin/user/${userID}/class-work/${subjectID}/${classWorkID}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getStudentAvailability: async (userID) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/availability`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _updateStudentAvailability: async (userID, data) => {
    try {
      const response = await apiService.put(
        `/admin/user/${userID}/availability`,
        data
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _updateProfile: async (userID, role, data) => {
    try {
      const response = await apiService.put(
        `/admin/user-profile?userID=${userID}&role=${role}`,
        data,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getTariffInfo: async (userID) => {
    try {
      const response = await apiService.get(`/admin/user/${userID}/tariff`);
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _updateTariffInfo: async (userID, data) => {
    try {
      const response = await apiService.put(
        `/admin/user/${userID}/tariff`,
        data
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getMeetingList: async (userID, paramsData) => {
    try {
      const response = await apiService.get(`/admin/user/${userID}/meetings`, {
        params: paramsData,
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getProxyMeetings: async (userID, paramsData) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/proxy-meetings`,
        {
          params: paramsData,
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getMeetingsReviewStat: async (userID, paramsData) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/meetings/review-stats`,
        {
          params: paramsData,
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getMeetingReviewList: async (userID, meetingID) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/meeting/${meetingID}/review`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getDocumentComments: async (userID, documentID, role) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/document/${documentID}/comments?role=${role}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getIndividualChatList: async (userID, paramsData) => {
    try {
      const response = await apiService.get(`/admin/user/${userID}/chats?`, {
        params: paramsData,
      });
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getIndividualChatDetails: async (userID, otherUserID, paramsData) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/messages/${otherUserID}`,
        {
          params: paramsData,
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getChatGroupList: async (userID, paramsData) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/group-chats`,
        {
          params: paramsData,
        }
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getChatGroupDetails: async (userID, groupID) => {
    try {
      const response = await apiService.get(
        `/admin/user/${userID}/group-messages/${groupID}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _requestForgotPassword: async (data) => {
    try {
      const response = await apiService.post(
        "/admin/forgot-password/request",
        data
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _forgotPasswordVerifyReset: async (data) => {
    try {
      const response = await apiService.post(
        "/admin/forgot-password/verify-and-reset",
        data
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteUser: async (userID, role) => {
    try {
      const response = await apiService.delete(
        `/admin/user/${userID}?role=${role}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _changeUserPassword: async (userID, role, data) => {
    try {
      const response = await apiService.put(
        `/admin/update-user-password?role=${role}&userID=${userID}`,
        data
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _updateFreeLessons: async (userID, data) => {
    try {
      const response = await apiService.put(
        `/admin/user/${userID}/free-lessons`,
        data
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _unassignedTeachers: async () => {
    try {
      const response = await apiService.get("/admin/unassigned-teachers");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _illegalMessages: async () => {
    try {
      const response = await apiService.get("/admin/illegal-messages");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _illegalGroupMessages: async () => {
    try {
      const response = await apiService.get("/admin/illegal-group-messages");
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _illegalIndividualDetails: async (chatID, userID, otherUserID) => {
    try {
      const response = await apiService.get(
        `/admin/illegal-message/${chatID}/${userID}/${otherUserID}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _illegalGroupDetails: async (chatID, userID, groupID) => {
    try {
      const response = await apiService.get(
        `/admin/illegal-group-message/${chatID}/${userID}/${groupID}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _appointProxyTeacher: async (data) => {
    try {
      const response = await apiService.put(
        "/admin/appoint-proxy-teacher",
        data
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _getDeleteRequest: async (data) => {
    console.log(data);
    try {
      const response = await apiService.get(
        `/admin/account-delete-requests?role=${data}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteUserAccount: async (userID, role) => {
    try {
      const response = await apiService.delete(
        `/admin/user/${userID}?role=${role}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
  _deleteIllegalMessage: async (messageID, type) => {
    try {
      const response = await apiService.delete(
        `/admin/illegal-message/${messageID}?type=${type}`
      );
      return response.data;
    } catch (error) {
      return error;
    }
  },
};
export { apiRequest, API_BASE_URL };
