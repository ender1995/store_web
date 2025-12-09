<template>
    <div class="forgot-password-page">
        <div class="card">
            <div class="card-body">
                <h3 class="card-title text-center">Forgot Password</h3>
                <form @submit.prevent="sendResetLink">
                    <div class="form-group mb-3">
                        <input
                            type="email"
                            v-model="email"
                            class="form-control"
                            placeholder="Enter your email"
                            required
                        />
                    </div>
                    <div class="form-group mb-3">
                        <button type="submit" class="btn btn-primary w-100">Send Reset Link</button>
                    </div>
                </form>
                <div v-if="message" class="alert alert-info mt-2">{{ message }}</div>
            </div>
        </div>
    </div>
</template>

<script>
import {FORGOT_PASSWORD_URL} from "../config/api";

export default {
    data() {
        return {
            email: "",
            message: ""
        };
    },
    methods: {
        async sendResetLink() {
            try {
                const res = await fetch(FORGOT_PASSWORD_URL, {
                    method: "POST",
                    headers: {"Content-Type": "application/json"},
                    body: JSON.stringify({
                        email: this.email,
                        baseUrl: window.location.origin
                    })
                });
                const text = await res.text();
                this.message = text;
            } catch (err) {
                console.error(err);
                this.message = "Server error, please try again later";
            }
        }
    }
};
</script>

<style scoped>
.forgot-password-page {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: 80vh;
    background-color: #f4f6f9;
}

.card {
    width: 400px;
    padding: 1.5rem;
}
</style>
