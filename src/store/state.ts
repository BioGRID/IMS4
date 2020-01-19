const state = {
    navDrawerMinimized: false,
    loadingOverlayVisible: false,
    messageList: [],
    socket: {
        isConnected: false,
        reconnectError: false,
        lastEchoMessage: '',
    },
};

export default state;
