if (process.env.NODE_ENV !== 'production') {
  const [initialMachine] = useState(machine)

  if (machine !== initialMachine) {
    console.warn(
      'Machine given to `useMachine` has changed between renders. This is not supported and might lead to unexpected results.\n' +
        'Please make sure that you pass the same Machine as argument each time.'
    )
  }
}
