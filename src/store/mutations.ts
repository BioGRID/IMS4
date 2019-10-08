const mutations = {
    TOGGLE_NAV_DRAWER: (state: any) => {
        state.navDrawerMinimized = !state.navDrawerMinimized;
    },
    TOGGLE_LOADING_OVERLAY: (state: any) => {
        state.loadingOverlayVisible = !state.loadingOverlayVisible;
    },
};

export default mutations;
