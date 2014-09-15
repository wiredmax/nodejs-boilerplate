{% macro script(fileName, async) %}
  <script type="text/javascript" src="{{assets_url}}/{{ fileName }}.js" charset="utf-8"{% if async %} async{% endif %}></script>
{% endmacro %}

{% macro bundle(bundleName) %}
  {{ script(bundleName + ".bundle") }}
{% endmacro %}

{% macro exposeData(exposedName, exposedData) %}
  var {{ exposedName }} = {{ exposedData|safe|json }};
{% endmacro %}