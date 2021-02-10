import Vue from "vue";
import InputSearch from "@/components/InputSearch";

function install(Vue, options = {}) {
    Vue.component(options.InputSearchName || "InputSearch", InputSearch);
}

export default install;

if (typeof window !== undefined && window.Vue && window.Vue === Vue)
    install(window.Vue);

export { InputSearch };
