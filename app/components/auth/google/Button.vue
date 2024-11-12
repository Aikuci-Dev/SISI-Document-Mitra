<template>
  <div id="login-provider-google">
    <component is="script" src="https://accounts.google.com/gsi/client" async />
    <div
      id="g_id_onload"
      :data-client_id="$config.public.auth.google.clientId"
      data-context="signin"
      data-ux_mode="popup"
      :data-login_uri="$config.public.auth.google.loginUri"
      data-nonce=""
      data-auto_prompt="false"
    ></div>

    <div
      class="g_id_signin"
      data-type="standard"
      data-shape="pill"
      data-theme="outline"
      data-text="signin_with"
      data-size="large"
      data-logo_alignment="left"
    ></div>
  </div>
</template>
