<template>
    <div class="hold-transition login-page">
        <div class="login-box">
            <div class="login-logo">
                <b>Admin</b>LTE Vue
            </div>
            <div class="card">
                <div class="card-body login-card-body">
                    <!-- Login message -->
                    <p class="login-box-msg">{{ $t("login.title") }}</p>

                    <!-- Login form -->
                    <form @submit.prevent="login">
                        <div class="input-group mb-3">
                            <input v-model="username" type="text" class="form-control"
                                   :placeholder="$t('login.username')" required/>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-user"></span>
                                </div>
                            </div>
                        </div>

                        <div class="input-group mb-3">
                            <input v-model="password" type="password" class="form-control"
                                   :placeholder="$t('login.password')" required/>
                            <div class="input-group-append">
                                <div class="input-group-text">
                                    <span class="fas fa-lock"></span>
                                </div>
                            </div>
                        </div>

                        <div class="row mb-2">
                            <div class="col-5">
                                <div class="icheck-primary">
                                    <input type="checkbox" class="me-1" id="remember" v-model="remember"/>
                                    <label for="remember">{{ $t("login.remember") }}</label>
                                </div>
                            </div>
                            <div class="col-7 text-right">
                                <router-link :to="{ name: 'ForgotPassword' }">{{ $t("login.forgot") }}</router-link>
                            </div>
                        </div>

                        <div class="row mb-3">
                            <div class="col-12 d-flex">
                                <!-- Language dropdown -->

                                <button type="submit" class="btn btn-primary btn-block me-1">
                                    {{ $t("login.signIn") }}
                                </button>

                                <div class="text-center">
                                    <div class="dropdown">
                                        <button class="btn btn-outline-dark dropdown-toggle" type="button"
                                                id="langDropdown"
                                                data-toggle="dropdown" aria-haspopup="true" aria-expanded="false">
                                            <img v-if="$i18n.locale === 'vi'" src="@/assets/flags/vi.svg" alt="VN"
                                                 width="20"/>
                                            <img v-else src="@/assets/flags/en.svg" alt="EN" width="20"/>
                                        </button>
                                        <div class="dropdown-menu" aria-labelledby="langDropdown">
                                            <a class="dropdown-item" href="#" @click.prevent="$i18n.locale = 'vi'">
                                                <img src="@/assets/flags/vi.svg" width="20" alt=""/> Tiếng Việt
                                            </a>
                                            <a class="dropdown-item" href="#" @click.prevent="$i18n.locale = 'en'">
                                                <img src="@/assets/flags/en.svg" width="20" alt=""/> English
                                            </a>
                                        </div>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    </div>
</template>

<script>
import {LOGIN_URL} from "../config/api";

export default {
    name: "Login",
    data() {
        return {
            username: "",
            password: "",
            remember: true,
            currentLang: "vi",
        };
    },

    created() {
        // Load language từ localStorage nếu có
        const savedLang = localStorage.getItem("lang");
        if (savedLang) {
            this.currentLang = savedLang;
            this.$i18n.locale = savedLang;
        }

        // Check remember_user và điền sẵn username + password
        const savedUser = localStorage.getItem("remember_user");
        const savedPwd = localStorage.getItem("remember_pwd");

        if (savedUser && savedPwd) {
            this.username = savedUser;
            this.password = atob(savedPwd); // decode Base64
            this.remember = true;
        }
    },
    methods: {


        async login() {
            try {
                const res = await fetch(LOGIN_URL, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        username: this.username,
                        password: this.password
                    })
                });
                const json = await res.json();

                if (json.code === 200 && json.data?.token) {
                    localStorage.setItem("access_token", json.data.token);

                    let rawScope = json.data.scope
                    let roleArr = String(rawScope).split(/[,\s]+/).filter(Boolean);
                    localStorage.setItem("scope", JSON.stringify(roleArr));

                    // Optional: remember me logic
                    if (this.remember) {
                        localStorage.setItem("remember_user", this.username);
                        const encodedPwd = btoa(this.password);
                        localStorage.setItem("remember_pwd", encodedPwd);
                    } else {
                        localStorage.removeItem("remember_user");
                        localStorage.removeItem("remember_pwd");
                    }

                    this.$router.push("/");
                } else {
                    alert("Login failed: " + (json.message || "Unknown error"));
                }
            } catch (err) {
                console.error(err);
                alert("Server error, please try again later");
            }
        }
    }
};
</script>

<style>
.login-page {
    background-color: #f4f6f9;
}

.login-card-body {
    padding: 2rem;
}

.dropdown img {
    margin-right: 5px;
}
</style>
