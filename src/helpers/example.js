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
  },
  middlewares: {
    onTransition: () => {},
  },
})
