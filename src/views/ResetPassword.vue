<template>
    <div class="reset-password-page">
        <div class="card">
            <div class="card-body">
                <h3 class="card-title text-center">Reset Password</h3>
                <form @submit.prevent="resetPassword">
                    <div class="form-group mb-3">
                        <input
                            type="password"
                            v-model="newPassword"
                            class="form-control"
                            placeholder="New password"
                            required
                        />
                    </div>
                    <div class="form-group mb-3">
                        <input
                            type="password"
                            v-model="confirmPassword"
                            class="form-control"
                            placeholder="Confirm password"
                            required
                        />
                    </div>
                    <div class="form-group mb-3">
                        <button type="submit" class="btn btn-primary w-100">Reset Password</button>
                    </div>
                </form>
            </div>
        </div>
    </div>
</template>

<script>
import Swal from "sweetalert2";
import {RESET_PASSWORD_URL} from "../config/api";

export default {
    data() {
        return {
            newPassword: "",
            confirmPassword: "",
            token: ""
        };
    },
    created() {
        const params = new URLSearchParams(window.location.search);
        this.token = params.get("token") || "";
    },
    methods: {
        async resetPassword() {
            if (this.newPassword !== this.confirmPassword) {
                Swal.fire("Error", "Passwords do not match", "error");
                return;
            }

            try {
                const res = await fetch(
                    `${RESET_PASSWORD_URL}?token=${this.token}&newPassword=${encodeURIComponent(this.newPassword)}`,
                    {method: "POST"}
                );
                const text = await res.text();

                if (text.includes("successfully")) {
                    let timerInterval;
                    Swal.fire({
                        title: 'Password reset successfully!',
                        html: 'Redirecting to login in <b></b> seconds.',
                        timer: 5000,
                        timerProgressBar: true,
                        didOpen: () => {
                            const b = Swal.getHtmlContainer().querySelector('b')
                            timerInterval = setInterval(() => {
                                const remaining = Math.ceil(Swal.getTimerLeft() / 1000)
                                b.textContent = remaining
                            }, 1000)
                        },
                        willClose: () => {
                            clearInterval(timerInterval)
                        }
                    }).then(() => {
                        this.$router.push({name: "Login"});
                    });
                } else {
                    Swal.fire("Error", text, "error");
                }

            } catch (err) {
                console.error(err);
                Swal.fire("Error", "Server error, please try again later", "error");
            }
        }
    }
};
</script>
