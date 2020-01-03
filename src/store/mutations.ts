const mutations = {
    TOGGLE_NAV_DRAWER: (state: any) => {
        state.navDrawerMinimized = !state.navDrawerMinimized;
    },
    TOGGLE_LOADING_OVERLAY: (state: any) => {
        state.loadingOverlayVisible = !state.loadingOverlayVisible;
    },
    ADD_MESSAGE: (state: any, message: string) => {
        state.messageList.push(message);
    },
    SOCKET_ONOPEN: (state: any, event: any) => {
        state.socket.isConnected = true;
    },
    SOCKET_ONCLOSE: (state: any, event: any) => {
        state.socket.isConnected = false;
    },
    SOCKET_ONERROR: (state: any, event: any) => {
        console.info( 'SOCKET_ERROR' );
        console.error(state, event);
    },
    SOCKET_RECONNECT: (state: any, event: any) => {
        console.info(state, event);
    },
    SOCKET_RECONNECT_ERROR: (state: any) => {
        state.socket.reconnectError = true;
    },
    SOCKET_ONMESSAGE: (state: any, message: any) => {
        console.info( 'SOCKET_MESSAGE_UNHANDLED' );
        console.info( message );
    },
};

export default mutations;
