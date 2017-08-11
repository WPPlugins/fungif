<?php

class FungifTinyMceExtension{

	public $btn_params;
	public $js_file;
	public $js_params;

	public function __construct($script_params){
		$this->btn_params = array('Seperator' => '|', 'Name' => 'fungif_tinymce_btn');
		$this->js_file = plugins_url('js/fungif-tinymce.js', __FILE__);
		$this->js_params = $script_params;
		add_action('init', array($this, 'add_tinymce_button'));
      	add_filter('tiny_mce_version', array($this, 'refresh_mce_version'));
      	
	}
	


    /*
     * create the buttons only if the user has editing privs.
     * If so we create the button and add it to the tinymce button array
     */
    function add_tinymce_button() {
      if (!current_user_can('edit_posts') && !current_user_can('edit_pages'))
        return;
      if (get_user_option('rich_editing') == 'true') {
        //the function that adds the javascript
        add_filter('mce_external_plugins', array($this, 'add_new_tinymce_plugin'));
        //adds the button to the tinymce button array
        add_filter('mce_buttons', array($this, 'register_new_button'));
        wp_enqueue_style('fungif-style', fungif_file_url('css/fungif.css'));
      }
    }

    /*
     * add the new button to the tinymce array
     */
    function register_new_button($buttons) {
      array_push($buttons, $this->btn_params["Seperator"], $this->btn_params["Name"]);
      return $buttons;
    }

    /*
     * Call the javascript file that loads the
     * instructions for the new button
     */
    function add_new_tinymce_plugin($plugin_array) {
      $plugin_array[$this->btn_params['Name']] = $this->js_file;
      return $plugin_array;
    }

	
    /*
     * This function tricks tinymce in thinking
     * it needs to refresh the buttons
     */
    function refresh_mce_version($ver) {
      $ver += 3;
      return $ver;
    }

}



?>
