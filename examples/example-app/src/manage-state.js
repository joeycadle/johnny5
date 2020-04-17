import Johnny5, { getMachines } from 'johnny5'

// Temporary until tests and proper react connect()/hook created
const fetchUser = (id) => {
  const users = {
    '1': 'Joey',
    '2': 'Daniel',
    '3': 'Henry',
  }

  const promise = new Promise((resolve) => setTimeout(() => resolve(users[id]), 5000))

  return promise
}

const getUsername = (dispatch) => async (userId) => {
  dispatch('fetching')

  try {
    const result = await fetchUser(userId)
    console.log('xxx', result)
    dispatch({
      next: 'jumping',
      context: { user: result },
    })
  } catch (e) {}
}

const MachineA = Johnny5('machineA').create({
  state: 'idle',
  context: {
    user: null,
  },
  transitions: {
    idle: {
      getUsername,
      consoleWarn: (dispatch) => () => {
        console.warn('foobarbazqux')
        dispatch('warning')
      },
    },
    fetching: {
      success: 'idle',
    },
    warning: {
      stop: 'idle',
    },
  },
})

export function consoleLogMachine() {
  console.log('machine from reference', MachineA)
  console.log('machine from factory', Johnny5('machineA'))
  console.log('machines', getMachines())
  console.log('state', MachineA.state())
  console.log('creator: consoleWarn', MachineA.consoleWarn())
  console.log('state', MachineA.state())
  console.log('creator: stop', MachineA.stop())
  console.log('state', MachineA.state())
  console.log('creator: getUsername', MachineA.getUsername(1))
  console.log('state', MachineA.state())
  console.log('context', MachineA.context())

  setTimeout(() => {
    console.log('state post timeout', MachineA.state())
    console.log('context post timeout', MachineA.context())
  }, 6000)

  console.log('creator: success', MachineA.success())
  console.log('state', MachineA.state())
}
