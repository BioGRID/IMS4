const state = {
    navDrawerMinimized: false,
    loadingOverlayVisible: false,
    messageList: [],
    socket: {
        isConnected: false,
        reconnectError: false,
        lastEchoMessage: '',
    },
    pathCache: new Map<string, number>(),
};

export default state;
