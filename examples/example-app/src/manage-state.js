import Johnny5, { getMachines, addEventListener, removeEventListener } from 'johnny5'

const fetchUser = (id) => {
  const users = {
    '1': 'Joey',
    '2': 'Daniel',
    '3': 'Henry',
  }

  const promise = new Promise((resolve) => setTimeout(() => resolve(users[id]), 5000))

  return promise
}

const getUsername = async (context, { userId }) => {
  try {
    const result = await fetchUser(userId)

    return {
      dispatch: { transition: 'success', args: { hello: 'world' } },
      context: { user: result },
      meta: { foo: 'bar' },
    }
  } catch (e) {}
}

const MACHINE_CONFIG = {
  state: 'idle',
  context: {
    user: null,
  },
  transitions: {
    idle: {
      $on: (context, event) => console.log('idle $on event', event),
      getUsername: 'fetching',
      error: 'erroring',
      consoleWarn: { next: 'warning', meta: { baz: 'qux' } },
    },
    fetching: {
      $on: getUsername,
      success: 'idle',
    },
    erroring: {
      stop: 'idle',
    },
    warning: {
      $on: () => console.warn('warning!'),
      stop: 'idle',
    },
  },
}

const MachineA = Johnny5('machineA').create({ ...MACHINE_CONFIG })
const MachineB = Johnny5('machineB').create({ ...MACHINE_CONFIG })

export function consoleLogMachine() {
  // Temporary until tests and proper react connect()/hook created
  console.log('---------------------------------------')
  console.log('MACHINE REFERENCES')
  console.log('---------------------------------------')
  console.log('machine from reference', MachineA)
  console.log('machine from factory', Johnny5('machineA'))
  console.log('machines', getMachines())
  console.log('---------------------------------------')
  console.log('OBJ WITH UPDATES AND $on')
  console.log('---------------------------------------')
  console.log('State:', MachineA.state())
  console.log('Meta', MachineA.meta())
  console.log('Dispatch: consoleWarn')
  MachineA.dispatch('consoleWarn')
  console.log('State:', MachineA.state())
  console.log('Meta', MachineA.meta())
  console.log('Dispatch: stop')
  MachineA.dispatch('stop')
  console.log('State:', MachineA.state())
  console.log('---------------------------------------')
  console.log('ADD LOCAL LISTENER AND TRIGGER IT')
  console.log('---------------------------------------')
  console.log('Local Listener: Add')
  MachineA.addEventListener('TRANSITION', {
    id: 'myLocalListener',
    listener: (event, state, context, meta) => {
      console.log('Local Listener Callback!', event)
    },
  })
  console.log('Dispatch: consoleWarn')
  MachineA.dispatch('consoleWarn', { foo: 'bar' })
  console.log('Dispatch: stop')
  MachineA.dispatch('stop')
  console.log('---------------------------------------')
  console.log('ADD GLOBAL LISTENER AND TRIGGER IT')
  console.log('---------------------------------------')
  console.log('Global Listener: Add')
  addEventListener('TRANSITION', {
    id: 'myGlobalListener',
    listener: (event, state, context, meta) => {
      console.log('Global Listener Callback!', event)
    },
  })
  console.log('Dispatch (MACHINE A): consoleWarn')
  MachineA.dispatch('consoleWarn', { foo: 'bar' })
  console.log('Dispatch (MACHINE B): consoleWarn')
  MachineB.dispatch('consoleWarn', { foo: 'bar' })
  console.log('Dispatch (MACHINE A): stop')
  MachineA.dispatch('stop')
  console.log('---------------------------------------')
  console.log('REMOVE LISTENERS AND TRIGGER TRANSITION')
  console.log('---------------------------------------')
  console.log('Removing global and local listeners')
  removeEventListener('TRANSITION', 'myGlobalListener')
  MachineA.removeEventListener('TRANSITION', 'myLocalListener')
  console.log('Dispatch: consoleWarn')
  MachineA.dispatch('consoleWarn', { foo: 'bar' })
  console.log('Dispatch: stop')
  MachineA.dispatch('stop')
  console.log('---------------------------------------')
  console.log('INVALID TRANSITION')
  console.log('---------------------------------------')
  console.log('State:', MachineA.state())
  console.log('Dispatch: error')
  MachineA.dispatch('error')
  console.log('State:', MachineA.state())
  console.log('Dispatch: error')
  MachineA.dispatch('error')
  console.log('Dispatch: stop')
  MachineA.dispatch('stop')
  console.log('State:', MachineA.state())
  console.log('---------------------------------------')
  console.log('STRING WITH ASYNC $on with OBJ return')
  console.log('---------------------------------------')
  console.log('State:', MachineA.state())
  console.log('Dispatch: getUsername')
  MachineA.dispatch('getUsername', { userId: 1 })
  console.log('State:', MachineA.state())
  console.log('Context', MachineA.context())
  console.log('Meta', MachineA.meta())

  setTimeout(() => {
    console.log('---------------------------------------')
    console.log('POST RESOLVE of fetching $on')
    console.log(`dispatch a 'success' which transitions`)
    console.log(`to idle with arguments { hello: 'world' }`)
    console.log('---------------------------------------')
    console.log('State:', MachineA.state())
    console.log('Context:', MachineA.context())
    console.log('Meta:', MachineA.meta())
  }, 5010)
}
