let Web3 = require('web3');
const constants = require('../constants/constants');
const admin = require('firebase-admin');
require('dotenv').config();

admin.initializeApp({
  credential: admin.credential.cert({
    projectId: process.env.FIREBASE_DEV_PROJECT_ID,
    clientEmail: process.env.FIREBASE_DEV_CLIENT_EMAIL,
    privateKey: process.env.FIREBASE_DEV_PRIVATE_KEY.replace(/\\n/g, '\n'),
  }),
  databaseURL: process.env.FIREBASE_DEV_DB_URL,
});

class EventWorker {
  constructor() {
    this.web3 = new Web3(this.getProvider());
    this.contractInstance = new this.web3.eth.Contract(
      constants.ropstenAbi,
      constants.ropstenContractAddress
    );
    this.daiInstance = new this.web3.eth.Contract(
      constants.daiABI,
      constants.daiRopstenAddress
    );
  }

  assembleFirestoreJobDoc(currentJob, jobID) {
    let state = 1;
    let stateMap = {
      0: 1, // open
      1: 2, // inProgress
      2: 3, // completed
      3: 4, // cancelled
      // smart contract doesn't support unsuccessfullyCompleted yet
    }

    if (stateMap[currentJob._status]) {
      state = stateMap[currentJob._status];
    } else {
      null;
    }

    let updatedJob = {
      description: currentJob._description,
      noOfPaymentsMade: currentJob._noOfPaymentsMade,
      noOfTotalPayments: currentJob._noOfTotalPayments,
      paymentAvailableForWorker: currentJob._paymentAvailableForWorker,
      proofOfLastWorkVerified: currentJob._proofOfLastWorkVerified,
      role: [currentJob._manager, currentJob._evaluator, currentJob._worker],
      salaryDeposited: currentJob._salaryDeposited,
      sponsoredAmount: currentJob._sponsoredTokens,
      sponsorsCount: currentJob._sponsorsCount,
      status: {
        state: state,
      },
      taskId: jobID,
      totalPaidToWorker: currentJob._totalPaidToWorker,
    };
    return updatedJob;
  }

  fetchJobDetailsAndSave(jobID) {
    const self = this;
    self.contractInstance.methods
      .getJob(jobID)
      .call()
      .then(function(job) {
        self.saveJobDetails(jobID, job);
      })
      .catch(function(getJobError) {
        console.error(constants.errorJobGet, getJobError);
      });
  }

  fetchAndSaveJobAndSponsorDetails(jobID) {
    const self = this;
    self.contractInstance.methods
      .get_Sponsors_list_by_Job(jobID)
      .call()
      .then(function(sponsors) {
        self.saveSponsorDetails(jobID, sponsors);
      })
      .catch(function(getSponsorsByJobError) {
        console.error(constants.errorSponsorsGet, getSponsorsByJobError);
      });
  }

  getProvider() {
    this.provider = new Web3.providers.WebsocketProvider(
      constants.ropstenWebSocket
    );
    this.provider.on('connect', () =>
      console.log(constants.websocketConnected)
    );
    return this.provider;
  }

  saveJobDetails(jobID, job) {
    const self = this;
    let jobDocRef = admin
      .firestore()
      .collection(constants.jobCollection)
      .doc(jobID);

    jobDocRef
      .get()
      .then(function(doc) {
        let assembledJob = self.assembleFirestoreJobDoc(job, jobID);
        if (doc.exists) {
          // if job is being cancelled, add timestamp
          if (parseInt(job._status) === 3) {
            assembledJob.status.dateCancelled = admin.firestore.Timestamp.now().toDate();
          }
          jobDocRef
            .update(assembledJob)
            .then(function() {
              console.log(constants.updateSuccess);
            })
            .catch(function(error) {
              console.error(constants.updateError, error);
            });
        } else {
          assembledJob["date-posted"] = admin.firestore.Timestamp.now().toDate();
          jobDocRef
            .set(assembledJob)
            .then(function() {
              console.log(constants.writeSuccess);
            })
            .catch(function(error) {
              console.error(constants.writeError, error);
            });
        }
      })
      .catch(function(jobDocRefError) {
        console.error(constants.errorJobGet, jobDocRefError);
      });
  }

  saveSponsorDetails(jobID, sponsors) {
    const self = this;
    let sponsorDocRef = admin
      .firestore()
      .collection(constants.sponsoredCollection)
      .doc(jobID);
    sponsorDocRef
      .get()
      .then(function(doc) {
        let tempObj = {
          sponsors: sponsors.list,
        };
        if (doc.exists) {
          if (sponsors.list.length > 0) {
            sponsorDocRef
              .update({
                sponsors: admin.firestore.FieldValue.arrayUnion.apply(
                  null,
                  sponsors.list
                ),
              })
              .then(function() {
                console.log(constants.updateSuccess);
              })
              .catch(function(error) {
                console.error(constants.updateError, error);
              });
          }
        } else {
          sponsorDocRef
            .set(tempObj)
            .then(function() {
              console.log(constants.writeSuccess);
            })
            .catch(function(error) {
              console.error(constants.writeError, error);
            });
        }
        self.fetchJobDetailsAndSave(jobID);
      })
      .catch(function(jobDocRefError) {
        console.log(constants.errorSponsorsGet, jobDocRefError);
      });
  }

  watchEvents() {
    const self = this;
    this.contractInstance.events.allEvents(
      { fromBlock: constants.latest },
      function(error, log) {
        if (!error) {
          if (self.shouldListenToEvent(log.event)) {
            let JobID = log.returnValues.JobID;
            self.fetchAndSaveJobAndSponsorDetails(JobID);
          }
        } else {
          console.error(constants.error, error);
        }
      }
    );

    this.isWatchingEvents = true;

    this.provider.on('error', e => {
      console.error(constants.websocketError);
      self.web3.setProvider(self.getProvider());

      self.isWatchingEvents = false;
      self.restartWatchEvents();
    });

    this.provider.on('end', e => {
      console.error(constants.websocketEnd);
      self.web3.setProvider(self.getProvider());

      self.isWatchingEvents = false;
      self.restartWatchEvents();
    });
  }

  restartWatchEvents() {
    if (this.isWatchingEvents) return;

    if (this.provider.connected) {
      this.watchEvents();
    } else {
      console.log(new Date());
      console.log(constants.delayRestart);
      setTimeout(this.restartWatchEvents.bind(this), 60 * 1000);
    }
  }

  shouldListenToEvent(eventName) {
    return constants.eventsToListenTo[eventName] ? true : false;
  }
}

module.exports = EventWorker;