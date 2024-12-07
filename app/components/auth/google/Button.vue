<script setup lang="ts">
useHead({
  script: [
    {
      src: 'https://accounts.google.com/gsi/client',
      async: true,
    },
  ],
});
</script>

<template>
  <div id="login-provider-google">
    <div
      id="g_id_onload"
      :data-client_id="$config.public.auth.google.clientId"
      data-context="signin"
      data-ux_mode="popup"
      :data-login_uri="$config.public.auth.google.loginUri"
      data-nonce=""
      data-auto_prompt="false"
    />

    <div
      class="g_id_signin"
      data-type="standard"
      data-shape="pill"
      data-theme="outline"
      data-text="signin_with"
      data-size="large"
      data-logo_alignment="left"
    />
  </div>
</template>
