const admin = require('firebase-admin');
const constants = require('../../constants/constants');
let EventWorker = require('../../worker/index.js');
let expect = require('chai').expect;
let Web3 = require('web3');
require('dotenv').config();

describe('EventWorker listening functionality', function() {
  this.timeout(0);

  let worker;
  let currentJobID;
  let sponsoredJobID;
  let currentJobTaskDescription = 'Test ' + new Date().toString();
  let testSalaryAmount = 2;
  let testTotalPayments = 1;
  let managerPublicAddress;
  let workerPublicAddress;
  let evaluatorPublicAddress;
  let gasToUse = 600000;

  before(function(done) {
    worker = new EventWorker();
    worker.watchEvents();

    const account = worker.web3.eth.accounts.privateKeyToAccount(
      process.env.MANAGER_TEST_PRIV_KEY
    );

    // account must always have sufficient ether balance and dai allowance
    worker.web3.eth.getBalance(account.address).then(console.log);
    managerPublicAddress = account.address;
    console.log(account);

    const query = worker.contractInstance.methods.createJob(
      currentJobTaskDescription,
      testSalaryAmount,
      testTotalPayments,
      constants.testEvaluatorAddress
    );
    const encodedABI = query.encodeABI();
    const tx = {
      from: managerPublicAddress,
      to: constants.ropstenContractAddress,
      gas: gasToUse,
      data: encodedABI,
    };

    worker.web3.eth.accounts
      .signTransaction(tx, process.env.MANAGER_TEST_PRIV_KEY)
      .then(signed => {
        const currentTransaction = worker.web3.eth.sendSignedTransaction(
          signed.rawTransaction
        );
        currentTransaction.on('confirmation', (confirmationNumber, receipt) => {
          console.log('Confirmation: ' + confirmationNumber);
        });
        currentTransaction.on('receipt', receipt => {
          console.log(receipt);
          worker.contractInstance.methods
            .jobCount()
            .call()
            .then(result => {
              currentJobID = result - 1;
              console.log(result);
              done();
            })
            .catch(function(err) {
              console.log('err...\n' + err);
            });
        });
        currentTransaction.on('error', error => {
          console.log(error.toString());
        });
      });
  });

  it('Created job should be saved in Firebase after triggering smart contract JobCreated event', function(done) {
    let jobDocRef = admin
      .firestore()
      .collection(constants.jobCollection)
      .doc(currentJobID.toString());
    jobDocRef
      .get()
      .then(function(doc) {
        expect(doc.exists).to.equal(true);
        done();
      })
      .catch(function(jobDocRefError) {
        console.error(constants.errorJobGet, jobDocRefError);
      });
  });

  it('Created job in smart contract should have the same task description as created job in Firebase', function(done) {
    let jobDocRef = admin
      .firestore()
      .collection(constants.jobCollection)
      .doc(currentJobID.toString());
    jobDocRef
      .get()
      .then(function(doc) {
        expect(doc.data().description).to.equal(currentJobTaskDescription);
        done();
      })
      .catch(function(jobDocRefError) {
        console.error(constants.errorJobGet, jobDocRefError);
      });
  });

  it('Created job in smart contract should create a new record in Firebase sponsors collection', function(done) {
    let sponsorDocRef = admin
      .firestore()
      .collection(constants.sponsoredCollection)
      .doc(currentJobID.toString());
    sponsorDocRef
      .get()
      .then(function(doc) {
        expect(doc.exists).to.equal(true);
        done();
      })
      .catch(function(jobDocRefError) {
        console.log(constants.errorSponsorsGet, jobDocRefError);
      });
  });

  before(function(done) {
    const account = worker.web3.eth.accounts.privateKeyToAccount(
      process.env.MANAGER_TEST_PRIV_KEY
    );

    // account must always have sufficient balance
    worker.web3.eth.getBalance(account.address).then(console.log);
    managerPublicAddress = account.address;
    console.log(account);

    const query = worker.contractInstance.methods.cancelJob(currentJobID);
    const encodedABI = query.encodeABI();
    const tx = {
      from: managerPublicAddress,
      to: constants.ropstenContractAddress,
      gas: gasToUse,
      data: encodedABI,
    };

    worker.web3.eth.accounts
      .signTransaction(tx, process.env.MANAGER_TEST_PRIV_KEY)
      .then(signed => {
        const currentTransaction = worker.web3.eth.sendSignedTransaction(
          signed.rawTransaction
        );
        currentTransaction.on('confirmation', (confirmationNumber, receipt) => {
          console.log('Confirmation: ' + confirmationNumber);
        });
        currentTransaction.on('receipt', receipt => {
          console.log(receipt);
          done();
        });
        currentTransaction.on('error', error => {
          console.log(error.toString());
        });
      });
  });

  it('Cancelled job should reflect in Firebase', function(done) {
    let jobID = currentJobID - 1;
    let jobDocRef = admin
      .firestore()
      .collection(constants.jobCollection)
      .doc(jobID.toString());
    jobDocRef
      .get()
      .then(function(doc) {
        expect(doc.data().status.state).to.equal(4);
        done();
      })
      .catch(function(jobDocRefError) {
        console.error(constants.errorJobGet, jobDocRefError);
      });
  });

  before(function(done) {
    const account = worker.web3.eth.accounts.privateKeyToAccount(
      process.env.MANAGER_TEST_PRIV_KEY
    );

    // account must always have sufficient balance
    worker.web3.eth.getBalance(account.address).then(console.log);
    managerPublicAddress = account.address;
    console.log(account);

    const query = worker.contractInstance.methods.createJob(
      currentJobTaskDescription,
      testSalaryAmount,
      testTotalPayments,
      constants.testEvaluatorAddress
    );
    const encodedABI = query.encodeABI();
    const tx = {
      from: managerPublicAddress,
      to: constants.ropstenContractAddress,
      gas: gasToUse,
      data: encodedABI,
    };

    worker.web3.eth.accounts
      .signTransaction(tx, process.env.MANAGER_TEST_PRIV_KEY)
      .then(signed => {
        const currentTransaction = worker.web3.eth.sendSignedTransaction(
          signed.rawTransaction
        );
        currentTransaction.on('confirmation', (confirmationNumber, receipt) => {
          console.log('Confirmation: ' + confirmationNumber);
        });
        currentTransaction.on('receipt', receipt => {
          console.log(receipt);
          worker.contractInstance.methods
            .jobCount()
            .call()
            .then(result => {
              currentJobID = result - 1;
              console.log(result);
              const account = worker.web3.eth.accounts.privateKeyToAccount(
                process.env.WORKER_TEST_PRIV_KEY
              );

              // account must always have sufficient balance
              worker.web3.eth.getBalance(account.address).then(console.log);
              workerPublicAddress = account.address;
              console.log(account);

              const query = worker.contractInstance.methods.claimJob(
                currentJobID
              );
              const encodedABI = query.encodeABI();
              const tx = {
                from: workerPublicAddress,
                to: constants.ropstenContractAddress,
                gas: gasToUse,
                data: encodedABI,
              };

              worker.web3.eth.accounts
                .signTransaction(tx, process.env.WORKER_TEST_PRIV_KEY)
                .then(signed => {
                  const currentTransaction = worker.web3.eth.sendSignedTransaction(
                    signed.rawTransaction
                  );
                  currentTransaction.on(
                    'confirmation',
                    (confirmationNumber, receipt) => {
                      console.log('Confirmation: ' + confirmationNumber);
                    }
                  );
                  currentTransaction.on('receipt', receipt => {
                    console.log(receipt);
                    done();
                  });
                  currentTransaction.on('error', error => {
                    console.log(error.toString());
                  });
                });
            })
            .catch(function(err) {
              console.log('err...\n' + err);
            });
        });
        currentTransaction.on('error', error => {
          console.log(error.toString());
        });
      });
  });

  it('Worker claimed job address should be up to date and same as in Firebase', function(done) {
    let jobDocRef = admin
      .firestore()
      .collection(constants.jobCollection)
      .doc(currentJobID.toString());
    jobDocRef
      .get()
      .then(function(doc) {
        expect(doc.data().role[2]).to.equal(workerPublicAddress);
        done();
      })
      .catch(function(jobDocRefError) {
        console.error(constants.errorJobGet, jobDocRefError);
      });
  });

  before(function(done) {
    const account = worker.web3.eth.accounts.privateKeyToAccount(
      process.env.EVALUATOR_TEST_PRIV_KEY
    );

    // account must always have sufficient balance
    worker.web3.eth.getBalance(account.address).then(console.log);
    evaluatorPublicAddress = account.address;
    console.log(account);

    const query = worker.contractInstance.methods.setEvaluator(currentJobID);
    const encodedABI = query.encodeABI();
    const tx = {
      from: evaluatorPublicAddress,
      to: constants.ropstenContractAddress,
      gas: gasToUse,
      data: encodedABI,
    };

    worker.web3.eth.accounts
      .signTransaction(tx, process.env.EVALUATOR_TEST_PRIV_KEY)
      .then(signed => {
        const currentTransaction = worker.web3.eth.sendSignedTransaction(
          signed.rawTransaction
        );
        currentTransaction.on('confirmation', (confirmationNumber, receipt) => {
          console.log('Confirmation: ' + confirmationNumber);
        });
        currentTransaction.on('receipt', receipt => {
          console.log(receipt);
          done();
        });
        currentTransaction.on('error', error => {
          console.log(error.toString());
        });
      });
  });

  it('Evaluator claimed job address should be up to date and same as in Firebase', function(done) {
    let jobDocRef = admin
      .firestore()
      .collection(constants.jobCollection)
      .doc(currentJobID.toString());
    jobDocRef
      .get()
      .then(function(doc) {
        expect(doc.data().role[1]).to.equal(evaluatorPublicAddress);
        done();
      })
      .catch(function(jobDocRefError) {
        console.error(constants.errorJobGet, jobDocRefError);
      });
  });

  before(function(done) {
    const account = worker.web3.eth.accounts.privateKeyToAccount(
      process.env.EVALUATOR_TEST_PRIV_KEY
    );

    // account must always have sufficient balance
    worker.web3.eth.getBalance(account.address).then(console.log);
    evaluatorPublicAddress = account.address;
    console.log(account);

    const query = worker.contractInstance.methods.confirmProofOfWork(
      currentJobID
    );
    const encodedABI = query.encodeABI();
    const tx = {
      from: evaluatorPublicAddress,
      to: constants.ropstenContractAddress,
      gas: gasToUse,
      data: encodedABI,
    };

    worker.web3.eth.accounts
      .signTransaction(tx, process.env.EVALUATOR_TEST_PRIV_KEY)
      .then(signed => {
        const currentTransaction = worker.web3.eth.sendSignedTransaction(
          signed.rawTransaction
        );
        currentTransaction.on('confirmation', (confirmationNumber, receipt) => {
          console.log('Confirmation: ' + confirmationNumber);
        });
        currentTransaction.on('receipt', receipt => {
          console.log(receipt);
          done();
        });
        currentTransaction.on('error', error => {
          console.log(error.toString());
        });
      });
  });

  it('Proof of last work verified should be true in Firebase if confirmProofOfWork is called in smart contract by evaluator ', function(done) {
    let jobDocRef = admin
      .firestore()
      .collection(constants.jobCollection)
      .doc(currentJobID.toString());
    jobDocRef
      .get()
      .then(function(doc) {
        expect(doc.data().proofOfLastWorkVerified).to.equal(true);
        done();
      })
      .catch(function(jobDocRefError) {
        console.error(constants.errorJobGet, jobDocRefError);
      });
  });

  before(function(done) {
    const account = worker.web3.eth.accounts.privateKeyToAccount(
      process.env.MANAGER_TEST_PRIV_KEY
    );

    // account must always have sufficient balance
    worker.web3.eth.getBalance(account.address).then(console.log);
    managerPublicAddress = account.address;
    console.log(account);

    const query = worker.contractInstance.methods.approvePayment(currentJobID);
    const encodedABI = query.encodeABI();
    const tx = {
      from: managerPublicAddress,
      to: constants.ropstenContractAddress,
      gas: gasToUse,
      data: encodedABI,
    };

    worker.web3.eth.accounts
      .signTransaction(tx, process.env.MANAGER_TEST_PRIV_KEY)
      .then(signed => {
        const currentTransaction = worker.web3.eth.sendSignedTransaction(
          signed.rawTransaction
        );
        currentTransaction.on('confirmation', (confirmationNumber, receipt) => {
          console.log('Confirmation: ' + confirmationNumber);
        });
        currentTransaction.on('receipt', receipt => {
          console.log(receipt);
          done();
        });
        currentTransaction.on('error', error => {
          console.log(error.toString());
        });
      });
  });

  it('Job state should be completed if approvePayment is called by manager', function(done) {
    let jobDocRef = admin
      .firestore()
      .collection(constants.jobCollection)
      .doc(currentJobID.toString());
    jobDocRef
      .get()
      .then(function(doc) {
        expect(doc.data().status.state).to.equal(3);
        done();
      })
      .catch(function(jobDocRefError) {
        console.error(constants.errorJobGet, jobDocRefError);
      });
  });

  before(function(done) {
    const account = worker.web3.eth.accounts.privateKeyToAccount(
      process.env.MANAGER_TEST_PRIV_KEY
    );

    // account must always have sufficient balance
    worker.web3.eth.getBalance(account.address).then(console.log);
    managerPublicAddress = account.address;
    console.log(account);

    const query = worker.contractInstance.methods.createJob(
      currentJobTaskDescription,
      testSalaryAmount,
      testTotalPayments,
      constants.testEvaluatorAddress
    );
    const encodedABI = query.encodeABI();
    const tx = {
      from: managerPublicAddress,
      to: constants.ropstenContractAddress,
      gas: gasToUse,
      data: encodedABI,
    };

    worker.web3.eth.accounts
      .signTransaction(tx, process.env.MANAGER_TEST_PRIV_KEY)
      .then(signed => {
        const currentTransaction = worker.web3.eth.sendSignedTransaction(
          signed.rawTransaction
        );
        currentTransaction.on('confirmation', (confirmationNumber, receipt) => {
          console.log('Confirmation: ' + confirmationNumber);
        });
        currentTransaction.on('receipt', receipt => {
          console.log(receipt);
          worker.contractInstance.methods
            .jobCount()
            .call()
            .then(result => {
              sponsoredJobID = result - 1;
              console.log(result);
              const account = worker.web3.eth.accounts.privateKeyToAccount(
                process.env.WORKER_TEST_PRIV_KEY
              );

              // account must always have sufficient balance
              worker.web3.eth.getBalance(account.address).then(console.log);
              workerPublicAddress = account.address;
              console.log(account);

              const query = worker.contractInstance.methods.claimJob(
                sponsoredJobID
              );
              const encodedABI = query.encodeABI();
              const tx = {
                from: workerPublicAddress,
                to: constants.ropstenContractAddress,
                gas: gasToUse,
                data: encodedABI,
              };

              worker.web3.eth.accounts
                .signTransaction(tx, process.env.WORKER_TEST_PRIV_KEY)
                .then(signed => {
                  const currentTransaction = worker.web3.eth.sendSignedTransaction(
                    signed.rawTransaction
                  );
                  currentTransaction.on(
                    'confirmation',
                    (confirmationNumber, receipt) => {
                      console.log('Confirmation: ' + confirmationNumber);
                    }
                  );
                  currentTransaction.on('receipt', receipt => {
                    console.log(receipt);

                    const account = worker.web3.eth.accounts.privateKeyToAccount(
                      process.env.MANAGER_TEST_PRIV_KEY
                    );

                    // account must always have sufficient balance
                    worker.web3.eth
                      .getBalance(account.address)
                      .then(console.log);
                    managerPublicAddress = account.address;
                    console.log(account);

                    const query = worker.contractInstance.methods.sponsorDAI(
                      sponsoredJobID,
                      1
                    );
                    const encodedABI = query.encodeABI();
                    const tx = {
                      from: managerPublicAddress,
                      to: constants.ropstenContractAddress,
                      gas: gasToUse,
                      data: encodedABI,
                    };

                    worker.web3.eth.accounts
                      .signTransaction(tx, process.env.MANAGER_TEST_PRIV_KEY)
                      .then(signed => {
                        const currentTransaction = worker.web3.eth.sendSignedTransaction(
                          signed.rawTransaction
                        );
                        currentTransaction.on(
                          'confirmation',
                          (confirmationNumber, receipt) => {
                            console.log('Confirmation: ' + confirmationNumber);
                          }
                        );
                        currentTransaction.on('receipt', receipt => {
                          console.log(receipt);
                          done();
                        });
                        currentTransaction.on('error', error => {
                          console.log(error.toString());
                        });
                      });
                  });
                  currentTransaction.on('error', error => {
                    console.log(error.toString());
                  });
                });
            })
            .catch(function(err) {
              console.log('err...\n' + err);
            });
        });
        currentTransaction.on('error', error => {
          console.log(error.toString());
        });
      });
  });

  it('Sponsoring a job adds the sponsor to the sponsors array in Firebase', function(done) {
    let sponsorDocRef = admin
      .firestore()
      .collection(constants.sponsoredCollection)
      .doc(sponsoredJobID.toString());
    sponsorDocRef
      .get()
      .then(function(doc) {
        let inequalityFlag = false;
        worker.contractInstance.methods
          .get_Sponsors_list_by_Job(sponsoredJobID)
          .call()
          .then(function(sponsors) {
            if (doc.data().sponsors.length !== sponsors.list.length) {
              inequalityFlag = true;
            }

            for (let i = 0; i < doc.data().sponsors.length; i++) {
              if (doc.data().sponsors[i] !== sponsors.list[i]) {
                inequalityFlag = true;
              }
            }

            expect(inequalityFlag).to.equal(false);
            done();
          })
          .catch(function(getSponsorsByJobError) {
            console.error(constants.errorSponsorsGet, getSponsorsByJobError);
          });
      })
      .catch(function(jobDocRefError) {
        console.error(constants.errorJobGet, jobDocRefError);
      });
  });
});
