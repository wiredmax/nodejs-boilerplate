{% import 'imports/scripts.swig' as scripts %}

<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="utf-8">
    <meta http-equiv="X-UA-Compatible" content="IE=edge">
    <meta name="viewport" content="width=device-width, initial-scale=1">
    <meta name="csrf-token" content="{{csrf_token}}">

    <title>{% block title %}Empty framework{% endblock %}</title>

    {# HTML5 shim and Respond.js IE8 support of HTML5 elements and media queries #}
    <!--[if lt IE 9]>
      <script src="https://oss.maxcdn.com/libs/html5shiv/3.7.0/html5shiv.js"></script>
      <script src="https://oss.maxcdn.com/libs/respond.js/1.4.2/respond.min.js"></script>
    <![endif]-->

    {# Stylesheet generated from webpack. #}
    <link href="{{assets_url}}/main.css" rel="stylesheet">
  </head>
  <body id="page-top" class="index">
    {% block body %}{% endblock %}

    {# !!! JavaScript - Placed at the end of the document so the pages load faster !!! #}

    {#
      Used to load initial data from the backend.
      NOTE: Script tag cannot be conditional to having content,
      see http://stackoverflow.com/q/19759113/564163.
    #}
    <script type="text/javascript" charset="utf-8">
    {% block data %}{% endblock %}
    </script>

    {# Webpack bundles. #}
    {{ scripts.script("common.bundle") }}
    {% block bundles %}{% endblock %}
  </body>
</html>
