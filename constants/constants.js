module.exports = {
  eventsToListenTo: {
    DAISponsored: 'sponsorJob',
    EvaluatorPaid: 'tipEvaluator',
    EvaluatorSet: 'setEvaluator',
    JobCancelled: 'cancelJob',
    JobCreated: 'createJob',
    JobClaimed: 'claimJob',
    PaymentApproved: 'payoutJob',
    PaymentClaimed: 'claimPayout',
    ProofOfWorkConfirmed: 'evaluateJobAsCompletedSucessfully',
    ProofOfWorkProvided: 'markJobComplete',
    TipMade: 'makeTipEscrow',
  },
  ropstenAbi: [
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      name: 'Jobs',
      outputs: [
        {
          name: 'description',
          type: 'string',
        },
        {
          name: 'manager',
          type: 'address',
        },
        {
          name: 'salaryDeposited',
          type: 'uint256',
        },
        {
          name: 'worker',
          type: 'address',
        },
        {
          name: 'status',
          type: 'uint8',
        },
        {
          name: 'noOfTotalPayments',
          type: 'uint256',
        },
        {
          name: 'noOfPaymentsMade',
          type: 'uint256',
        },
        {
          name: 'paymentAvailableForWorker',
          type: 'uint256',
        },
        {
          name: 'totalPaidToWorker',
          type: 'uint256',
        },
        {
          name: 'evaluator',
          type: 'address',
        },
        {
          name: 'proofOfLastWorkVerified',
          type: 'bool',
        },
        {
          name: 'sponsoredTokens',
          type: 'uint256',
        },
        {
          name: 'sponsorsCount',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address',
        },
        {
          name: '',
          type: 'uint256',
        },
      ],
      name: 'JobsByManager',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'jobCount',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'arbitrator',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [],
      name: 'DAI',
      outputs: [
        {
          name: '',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '',
          type: 'address',
        },
        {
          name: '',
          type: 'uint256',
        },
      ],
      name: 'JobsByWorker',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      inputs: [
        {
          name: '_DAI',
          type: 'address',
        },
        {
          name: '_arbitrator',
          type: 'address',
        },
      ],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'constructor',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'manager',
          type: 'address',
        },
        {
          indexed: false,
          name: 'salary',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'noOfTotalPayments',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'JobID',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'description',
          type: 'string',
        },
        {
          indexed: false,
          name: '_evaluator',
          type: 'address',
        },
      ],
      name: 'JobCreated',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'worker',
          type: 'address',
        },
        {
          indexed: false,
          name: 'JobID',
          type: 'uint256',
        },
      ],
      name: 'JobClaimed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'JobID',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'evaluator',
          type: 'address',
        },
      ],
      name: 'EvaluatorSet',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'JobID',
          type: 'uint256',
        },
      ],
      name: 'JobCancelled',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'worker',
          type: 'address',
        },
        {
          indexed: false,
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'JobID',
          type: 'uint256',
        },
      ],
      name: 'PaymentClaimed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'manager',
          type: 'address',
        },
        {
          indexed: false,
          name: 'JobID',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'PaymentApproved',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'manager',
          type: 'address',
        },
        {
          indexed: false,
          name: 'evaluator',
          type: 'address',
        },
        {
          indexed: false,
          name: 'JobID',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'payment',
          type: 'uint256',
        },
      ],
      name: 'EvaluatorPaid',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'JobID',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'evaluator',
          type: 'address',
        },
        {
          indexed: false,
          name: 'proofVerified',
          type: 'bool',
        },
      ],
      name: 'ProofOfWorkConfirmed',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'JobID',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'worker',
          type: 'address',
        },
        {
          indexed: false,
          name: 'proofProvided',
          type: 'bool',
        },
      ],
      name: 'ProofOfWorkProvided',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'from',
          type: 'address',
        },
        {
          indexed: false,
          name: 'to',
          type: 'address',
        },
        {
          indexed: false,
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'TipMade',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'JobID',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'amount',
          type: 'uint256',
        },
        {
          indexed: false,
          name: 'sponsor',
          type: 'address',
        },
      ],
      name: 'DAISponsored',
      type: 'event',
    },
    {
      anonymous: false,
      inputs: [
        {
          indexed: false,
          name: 'receiver',
          type: 'address',
        },
        {
          indexed: false,
          name: 'amount',
          type: 'uint256',
        },
      ],
      name: 'DAIWithdrawn',
      type: 'event',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_description',
          type: 'string',
        },
        {
          name: '_salary',
          type: 'uint256',
        },
        {
          name: '_noOfTotalPayments',
          type: 'uint256',
        },
        {
          name: '_evaluator',
          type: 'address',
        },
      ],
      name: 'createJob',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_JobID',
          type: 'uint256',
        },
      ],
      name: 'claimJob',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_JobID',
          type: 'uint256',
        },
      ],
      name: 'setEvaluator',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_JobID',
          type: 'uint256',
        },
      ],
      name: 'cancelJob',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_JobID',
          type: 'uint256',
        },
      ],
      name: 'claimPayment',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_JobID',
          type: 'uint256',
        },
      ],
      name: 'approvePayment',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_JobID',
          type: 'uint256',
        },
        {
          name: '_payment',
          type: 'uint256',
        },
      ],
      name: 'payToEvaluator',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_JobID',
          type: 'uint256',
        },
      ],
      name: 'confirmProofOfWork',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_JobID',
          type: 'uint256',
        },
      ],
      name: 'provideProofOfWork',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_to',
          type: 'address',
        },
        {
          name: '_amount',
          type: 'uint256',
        },
      ],
      name: 'tip',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_JobID',
          type: 'uint256',
        },
        {
          name: '_amount',
          type: 'uint256',
        },
      ],
      name: 'sponsorDAI',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: false,
      inputs: [
        {
          name: '_receiver',
          type: 'address',
        },
        {
          name: '_amount',
          type: 'uint256',
        },
      ],
      name: 'withdrawDAI',
      outputs: [],
      payable: false,
      stateMutability: 'nonpayable',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_JobID',
          type: 'uint256',
        },
        {
          name: '_sponsor',
          type: 'address',
        },
      ],
      name: 'get_Sponsored_Amount_in_Job_By_Address',
      outputs: [
        {
          name: '',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_JobID',
          type: 'uint256',
        },
      ],
      name: 'get_Sponsors_list_by_Job',
      outputs: [
        {
          name: 'list',
          type: 'address[]',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
    {
      constant: true,
      inputs: [
        {
          name: '_JobID',
          type: 'uint256',
        },
      ],
      name: 'getJob',
      outputs: [
        {
          name: '_description',
          type: 'string',
        },
        {
          name: '_manager',
          type: 'address',
        },
        {
          name: '_salaryDeposited',
          type: 'uint256',
        },
        {
          name: '_worker',
          type: 'address',
        },
        {
          name: '_status',
          type: 'uint256',
        },
        {
          name: '_noOfTotalPayments',
          type: 'uint256',
        },
        {
          name: '_noOfPaymentsMade',
          type: 'uint256',
        },
        {
          name: '_paymentAvailableForWorker',
          type: 'uint256',
        },
        {
          name: '_totalPaidToWorker',
          type: 'uint256',
        },
        {
          name: '_evaluator',
          type: 'address',
        },
        {
          name: '_proofOfLastWorkVerified',
          type: 'bool',
        },
        {
          name: '_sponsoredTokens',
          type: 'uint256',
        },
        {
          name: '_sponsorsCount',
          type: 'uint256',
        },
      ],
      payable: false,
      stateMutability: 'view',
      type: 'function',
    },
  ],
  daiABI: [
    {
      "constant": true,
      "inputs": [],
      "name": "name",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "totalSupply",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "decimals",
      "outputs": [
        {
          "name": "",
          "type": "uint8"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        }
      ],
      "name": "balanceOf",
      "outputs": [
        {
          "name": "balance",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [],
      "name": "symbol",
      "outputs": [
        {
          "name": "",
          "type": "string"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transfer",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "inputs": [],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "constructor"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "owner",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "spender",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Approval",
      "type": "event"
    },
    {
      "anonymous": false,
      "inputs": [
        {
          "indexed": true,
          "name": "from",
          "type": "address"
        },
        {
          "indexed": true,
          "name": "to",
          "type": "address"
        },
        {
          "indexed": false,
          "name": "value",
          "type": "uint256"
        }
      ],
      "name": "Transfer",
      "type": "event"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_from",
          "type": "address"
        },
        {
          "name": "_to",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "transferFrom",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": false,
      "inputs": [
        {
          "name": "_spender",
          "type": "address"
        },
        {
          "name": "_value",
          "type": "uint256"
        }
      ],
      "name": "approve",
      "outputs": [
        {
          "name": "",
          "type": "bool"
        }
      ],
      "payable": false,
      "stateMutability": "nonpayable",
      "type": "function"
    },
    {
      "constant": true,
      "inputs": [
        {
          "name": "_owner",
          "type": "address"
        },
        {
          "name": "_spender",
          "type": "address"
        }
      ],
      "name": "allowance",
      "outputs": [
        {
          "name": "",
          "type": "uint256"
        }
      ],
      "payable": false,
      "stateMutability": "view",
      "type": "function"
    }
  ],
  delayRestart: 'Delay restartWatchEvents',
  dummyHash: 'FA944B720A383D9AAE5412B943E156F0477DCF7DE7D24FA6AFDDAC3D45F66DC1',
  latest: 'latest',
  ropstenContractAddress: '0x99aFc9e1F4C4530e953d5805F8E38aB18412ff14',
  daiRopstenAddress: '0xef6d6edd1Cf7124b303D5bC980928cC0345BEbb6',
  ropstenWebSocket: 'wss://ropsten.infura.io/ws',
  zeroX: '0x',
  error: 'Error: ',
  errorJobGet: 'Error getting job: ',
  errorSponsorsGet: 'Error getting sponsors: ',
  managerPublicAddress: '0x8e0f2076dcE1259C154eFdd2551dB6912150d2C4',
  workerPublicAddress: '0x657670965Cc90a84a0DaD2F615E6D000940ec19e',
  evaluatorPublicAddress: '0xf4D4f7538b65EBE7f0D2eBd9C26B585960a30399',
  testEvaluatorAddress: '0xcF11D5BfD84a81636fa7A67440D905d3DEEc1976',
  jobCollection: 'jobs-v3',
  sponsoredCollection: 'sponosered',
  websocketConnected: 'WS Connected',
  websocketEnd: 'WS End',
  websocketError: 'WS Error',
  updateError: 'Error updating document: ',
  updateSuccess: 'Document update success',
  writeError: 'Error writing document: ',
  writeSuccess: 'Document write success',
};