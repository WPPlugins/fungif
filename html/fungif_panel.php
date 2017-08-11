<?php

$parent = isset($_GET['parent']) ? $_GET['parent'] : '';

$panel_url = 'https://www.funpica.com/api/oxwall/expanded_panel.php?parent=' . $parent;



?>

<html>
<body style="margin: 0px; padding: 0px; boder: 0px">
<iframe src='<?=$panel_url ?>' width='100%' height='100%'></iframe>
<body>
</html>