import axios from "axios";
//import { auth, googleAuthProvider } from "../firebase/firebase";
import { auth, googleAuthProvider, user } from "../firebase/firebase.js";
import toastr from "toastr";
import { func } from "prop-types";

export const login = (values) => {
  //const finalValues = values;
  //finalValues.dontSendToken = true;
  return new Promise((resolve, reject) => {
    auth
      .signInWithEmailAndPassword(values.email, values.password)
      .then((authUser) => resolve(authUser))
      .catch((error) => reject(error));
  });
};

export const logout = () => {
  return new Promise((resolve, reject) => {
    auth
      .signOut()
      .then((authUser) => {
        resolve(authUser);
      })
      .catch((error) => reject(error));
  });
};

export const loginWithGoogle = (values) => {
  const finalValues = values;
  finalValues.dontSendToken = true;
  return new Promise((resolve, reject) => {
    auth
      .signInWithPopup(googleAuthProvider)
      .then((authUser) => authUser)
      .catch((error) => error);
  });
};

export const signup = (values) => {
  const finalValues = values;
  finalValues.dontSendToken = true;
  return new Promise((resolve, reject) => {
    auth
      .createUserWithEmailAndPassword(values.email, values.password)
      .then((user) => {
        var actionCodeSettings = {
          handleCodeInApp: false,
          url: "https://telepuja-qa.web.app/",
        };
        auth.currentUser
          .sendEmailVerification(actionCodeSettings)
          .then(function () {
            var user = auth.currentUser;
            var name, email, photoUrl, uid, emailVerified;
            if (user != null) {
              name = user.displayName;
              email = user.email;
              photoUrl = user.photoURL;
              emailVerified = user.emailVerified;
              uid = user.uid;
            }
            var sendObj = {
              userId: uid,
              email: email,
              role: values.role,
              firstName: values.firstName,
              lastName: values.lastName
            };
            axios
              .post(
                `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/devotees`,
                sendObj
              )
              .then((result) => {
                if (result) {
                  auth.signOut().then(function () {
                    toastr.success(
                      "A verification mail has been sent to your registered email. Please verify!"
                    );
                    setTimeout(function () {
                      window.location = "/login";
                    }, 3000);
                  });
                }
              })
              .catch((error) => {
                reject(error);
              });
          });
      })
      .catch(function (error) {
        if (error.code === "auth/email-already-in-use") {
          toastr.error(`Your provided Email ${values.email} has already been used. Please use another Email address.`);
          /*  setTimeout(function () {
             window.location = "/";
           }, 3200); */
        }
        else {
          toastr.error("Enter a valid email address");
        }
      });
  });
};

export const forgotPassword = (email) => {
  return new Promise((resolve, reject) => {
    var actionCodeSettings = {

      handleCodeInApp: false,
      url: "https://telepuja-qa.web.app/login",
    };

    auth
      .sendPasswordResetEmail(email, actionCodeSettings)
      .then((authUser) => {
        resolve(authUser)
        /* toastr.success(
          "An link has been sent to " + email + " Please reset the password using the link"
        ); */
        setTimeout(function () {
          window.location = "/login";
        }, 3300);
      }
      )
      .catch((error) => {
        reject(error);
        //toastr.error(error.message);
      });
  });
};
export const changepassword = (password) => {
  return new Promise((resolve, reject) => {
    user.updatePassword(password).then(function (updatedPassword) {
      resolve(updatedPassword);
    }).catch(function (error) {
      reject(error);
    });
  });
}
export const verification = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        "https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/razorpay/verification",
        values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const userRegisterDetails = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/update/devotee`,
        values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createUserDetails = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/create/devotee`,
        values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getLoggedinUserDetails = (userId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/users/${userId}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateProfilePictures = (id,role, image) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/users/picutre/${id}?role=${role}`, image
      )
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};


export const getCountry = (userId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/devotees/country/${userId}`
      ).then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const getNotificationCount = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://us-central1-telepuja-qa.cloudfunctions.net/app/api/v1/notification/count`,
        values
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const updateNotifRequest = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/requests/${values.notificationId}`,
        values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const markAsComplete = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/complete/request/${id}`
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const updateNotificationCount = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://us-central1-telepuja-qa.cloudfunctions.net/app/api/v1/update/notifications`,
        values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getTodayPurohitPuja = (userId, type) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/requests/${userId}?role=${type}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getAllPurohitPuja = (userId, type) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/purohith/pujas/${userId}?type=${type}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getUpcomingPurohitPuja = (userId, role) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/requests/future/${userId}/${role}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getPurohitTransactions = (userId, role) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/transactions/${userId}?role=${role}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getPurohitNotifications = (userId, role) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/notifications/${userId}/${role}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getListOfStates = (country) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/states/${country}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const getListOfCities = (state) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/cities/${state}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

// export const getListOfCities = (country) => {
//   return new Promise((resolve, reject) => {
//     axios
//       .get(
//         `https://us-central1-telepuja-qa.cloudfunctions.net/app/api/v1/devotee/cities/${country}`
//       )
//       .then((result) => {
//         if (result) {
//           resolve(result.data.data);
//         }
//       })
//       .catch((error) => {
//         reject(error);
//       });
//   });
// };

export const getTemplesList = (city) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://us-central1-telepuja-qa.cloudfunctions.net/app/api/v1/devotee/temples/${city}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getPurohitList = (state, role) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://telepuja-qa.uc.r.appspot.com/purohiths?_where[state]=${state}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getPurohitServiceList = (purohitId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://us-central1-telepuja-qa.cloudfunctions.net/app/api/v1/devotee/seva/${purohitId}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getPujaList = (templeId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://us-central1-telepuja-qa.cloudfunctions.net/app/api/v1/devotee/puja/${templeId}`
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getServicesList = (sevaId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/purohithservices/${sevaId}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const createDevoteeRequest = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/requests`,
        values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getSpecialDays = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/devotee/events/${id}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getPurohitServices = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://us-central1-telepuja-qa.cloudfunctions.net/app/api/v1/notifications/data/${id}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getTemplePurohits = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://telepuja-qa.uc.r.appspot.com/temples/${id}`)
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getCustomerDetails = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://us-central1-telepuja-qa.cloudfunctions.net/app/api/v1/customerdetails/${id}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const templeServicesDetails = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://us-central1-telepuja-qa.cloudfunctions.net/app/api/v1/create/temple/service`,
        values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const paypalDetails = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/transactions`,
        values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getpurohitnames = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/purohiths`)
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getTempleNames = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/temples`)
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const getTempleServices = (templeId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/templeservices/${templeId}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const getUserLocaleInfo = () => {
  return new Promise((resolve, reject) => {
    axios
      .get("https://api.ipdata.co/?api-key=test", {
        mode: "no-cors",
      })
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject({ message: "getUserLocaleInfo Failed. " + error.message });
      });
  });
};
export const getAllCountries = () => {
  return new Promise((resolve, reject) => {
    axios
      .get(`https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/countries`)
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject({ message: "getAllCountries Failed. " + error.message });
      });
  });
};
export const getAllTemplesByCity = (cityId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://telepuja-qa.uc.r.appspot.com/temples?_where[city]=${cityId}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject({ message: "getAllCountries Failed. " + error.message });
      });
  });
};
export const getAllTemplesByState = (stateId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://telepuja-qa.uc.r.appspot.com/temples?_where[city]=${stateId}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject({ message: "getAllCountries Failed. " + error.message });
      });
  });
};

export const sendDevoteeEmail = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        'https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/mail/devotee', values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const sendPurohithEmail = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        'https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/mail/purohith', values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const acceptEmail = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        'https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/mail/accept', values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const templeAcceptEmail = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        'https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/mail/templeaccept', values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const rejectEmail = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        'https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/mail/reject', values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}


export const sendContactComplaintMail = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/mail/complaint`,
        values)
      .then((result) => {
        if (result) {
          resolve(result.data);
          toastr.success("Thankyou for your feedback.We will get back to you soon!");
          setInterval(() => {
            window.location = '/'
          }, 5000);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const sendContactFeedbackMail = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/mail/feedback`,
        values)
      .then((result) => {
        if (result) {
          resolve(result.data);
          toastr.success("Thankyou for your feedback.We will get back to you soon!");
          setInterval(() => {
            window.location = '/'
          }, 5000);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const devoteeDonateMail = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/mail/devotee/donate`,
        values)
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};
export const purohithDonateMail = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/mail/purohith/donate`,
        values)
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const thankYouMail = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/mail/thankyou`,
        values)
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};

export const purohithCancelMail = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        'https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/mail/purohith/cancel', values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const devoteeCancelMail = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        'https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/mail/devotee/cancel', values
      )
      .then((result) => {
        if (result) {
          resolve(result);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const updateUserDetails = (userId,role, values) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/users/${userId}?role=${role}`,
        values
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
};



//automatic country determination.
export const initCountry = () => {
  const countryCodeExpression = /loc=([\w]{2})/;
  const userIPExpression = /ip=([\w\.]+)/;
  return new Promise((resolve, reject) => {
    axios
      .get('https://www.cloudflare.com/cdn-cgi/trace', { headers: { 'Accept-Language': '' } })
      .then((responseText) => {
        if (responseText.status == 200) {
          let response = responseText.request.response;
          let countryCode = countryCodeExpression.exec(response);
          let ip = userIPExpression.exec(response);
          if (countryCode === null || countryCode[1] === '' ||
            ip === null || ip[1] === '') {
            reject('IP/Country code detection failed');
          }
          let result = {
            "countryCode": countryCode[1],
            "IP": ip[1]
          }
          resolve(result)
        }
      })
      .catch((error) => {
        reject(error);
      });

  });
}
export const cancelService = (id,status) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/requestscancel/${id}/${status}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const purohithCancelService = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/purohithrequestscancel/${id}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const createTimeSlot = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/timeslots`,
        values)
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const donation = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/donations`, values
      )
      .then((result) => {
        if (result) {
          resolve(result.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const getBookedTimeSlot = (id, type, date) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/timeslots/${id}/${type}/${date}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const getTimeSlot = (id, serviceId, date) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/gettimeslots/${id}/${serviceId}/${date}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const updateAsCompleted = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .put(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/requestscomplete/${id}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const createMeetId = (date, time, serviceid, id) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/requestjitsimeet/${date}/${time}/${serviceid}/${id}`
      )
      .then((result) => {
        if (result) {
          resolve(result.data.data);
        }
      })
      .catch((error) => {
        reject(error);
      });
  });
}

export const makeFavourite = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/favourites`, values
      )
      .then(function (result) {
        resolve(result.data.data);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}
export const readFavourite = (devoteeId) => {
  return new Promise((resolve, reject) => {
    axios
      .get(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/favourites/${devoteeId}`
      )
      .then(function (result) {
        resolve(result.data.data);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

export const removeFavourite = (favourite) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/favourites/${favourite}`
      )
      .then(function (result) {
        resolve(result.data.data);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}
export const removeAllFavourites = (id) => {
  return new Promise((resolve, reject) => {
    axios
      .delete(
        `https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/favourites/remove/${id}`
      )
      .then(function (result) {
        resolve(result);
      })
      .catch(function (err) {
        reject(err);
      });
  });
}

export const generateJwt = (values) => {
  return new Promise((resolve, reject) => {
    axios
      .post(`https://api-server-dot-telepuja-qa-342010.el.r.appspot.com/api/v1/jwt`, values)
      .then(function (resp) {
        if (resp) {
          resolve(resp.data.data);
        }
      })
      .catch(function (err) {
        reject(err);
      });
  });
}