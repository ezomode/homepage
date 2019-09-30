import './style.css'

var serialize = function (form) {
  var serialized = ''

  for (var i = 0; i < form.elements.length; i++) {

    var field = form.elements[i]

    if (!field.name || field.disabled || field.type === 'file' || field.type === 'reset' || field.type === 'submit' || field.type === 'button') continue

    if ((field.type !== 'checkbox' && field.type !== 'radio') || field.checked) {
      serialized += '&' + encodeURIComponent(field.name) + "=" + encodeURIComponent(field.value)
    }
  }

  return serialized;
}

window.displayMailChimpStatus = function (data) {
  if (!data.result || !data.msg) return

  var mcStatus = document.querySelector('.mc-status')

  if (!mcStatus) return

  mcStatus.innerHTML = data.msg

  //mcStatus.addAttribute('tabindex', '-1')
  mcStatus.focus()

  mcStatus.classList.remove('hidden')

  if (data.result === 'error') {
    mcStatus.classList.remove('mc-success')
    mcStatus.classList.add('mc-error')
    return;
  }

  mcStatus.classList.remove('mc-error');
  mcStatus.classList.add('mc-success')
}

var submitMailChimpForm = function (form) {
  var url = form.getAttribute('action')
  url = url.replace('/post?u=', '/post-json?u=')
  url += serialize(form) + '&c=displayMailChimpStatus'

  var script = window.document.createElement('script')
  script.src = url

  var ref = window.document.getElementsByTagName('script')[0]
  ref.parentNode.insertBefore(script, ref)

  script.onload = function () {
    this.remove()
  }
}

document.addEventListener('submit', function (event) {
  if (!event.target.classList.contains('validate')) return

  event.preventDefault()

  submitMailChimpForm(event.target)

}, false)