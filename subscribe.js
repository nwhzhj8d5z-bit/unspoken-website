function subscribeUser(event, form) {
  event.preventDefault();
  var email = form.querySelector('input[name="email"]').value;
  var GS_URL = "https://script.google.com/macros/s/AKfycbwSlNTSC2c1EM5B4yq7FhyDA5wM02H26aMuGpYX0CtcyJXUHe_sKF5Fya_u4Hvmg5NJrQ/exec";

  fetch(GS_URL, {
    method: "POST",
    mode: "no-cors",
    headers: { "Content-Type": "text/plain" },
    body: JSON.stringify({ email: email })
  }).finally(function () {
    window.location.href = "thankyou.html";
  });

  return false;
}
