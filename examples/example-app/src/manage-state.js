import Johnny5 from '../../../src'

const MachineA = Johnny5('machineA').create({
  state: 'idle',
  context: {
    user: null,
  },
  transitions: {
    idle: {
      jumping: () => {
        return {
          next: 'jumping',
          context: { foo: 'bar' },
        }
      },
    },
    jumping: {
      stop: 'idle',
    },
  },
  middlewares: {
    onTransition: () => {},
  },
})

export function consoleLogMachine() {
  console.log('reference', MachineA)
  console.log('factory', Johnny5('machineA'))
}
