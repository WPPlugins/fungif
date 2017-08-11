<?php
/*
Plugin Name: FUNGIF
Plugin URI: https://wordpress.org/plugins/fungif/
Description: A GIF plugin allow post readers to leave awesome funny GIF comments.
Version: 2.0
Author: Funpica.com
Author URI: https://www.funpica.com
License: GPL
*/

include_once dirname(__FILE__) . '/includes.php';

add_action('comment_post','fungif_comment_callback', 10, 3);
add_filter('the_content', 'fungif_on_post_render');
add_action('wp_footer', 'fungif_init_script_params', 5);
add_action('admin_footer', 'fungif_init_script_params', 5);

//Callback function
function fungif_comment_callback($comment_id)
{

	if (!isset($_POST['fungif_id'])  || !isset($_POST['fungif_name']))
	{
		return;
	}
	
	
	$fungif_id = is_numeric($_POST['fungif_id']) ? $_POST['fungif_id'] : 0;
	$fungif_name = sanitize_file_name($_POST['fungif_name']);
	

	if ($fungif_id <= 0 || $fungif_id > 999999999){
		return;
	}
	
	if (empty($fungif_name)){
		return;
	}
	
	$fungif_html = fungif_compile_gif($fungif_id, $fungif_name);
	
	global $wpdb;
	$wpdb->update( 
		$wpdb->comments,   //table
		array( 'comment_content' => $_POST['comment'] . $fungif_html),   //column and value
		array( 'comment_ID' => $comment_id ),  //where
		array( '%s'),   // column format
		array( '%d' )  //where format
	);
	
	setcookie('cleanfungifcookie', '1', 0, '/');
	
}

function fungif_on_post_render($content){
	
	wp_enqueue_style('fungif-style', fungif_file_url('css/fungif.css'));
	wp_register_script('fungif-script-comment', fungif_file_url('js/fungif-comment.js'), array( 'jquery', 'jquery-masonry' ), NULL, true);
    wp_enqueue_script('fungif-script-comment');
    
    wp_enqueue_script('fungif-jquery-cookies', fungif_file_url('js/jquery.cookie.js'));
    wp_enqueue_style('fungif-colorbox-style', fungif_file_url('colorbox/colorbox.css'));
    wp_enqueue_script('fungif-colorbox-script', fungif_file_url('colorbox/jquery.colorbox.js'));
    
    return $content;
    
}

function fungif_file_url($file_name){
	return plugins_url($file_name, __FILE__);
}

function fungif_init_script_params(){
	print_r(fungif_generate_script_params());
	print_r(fungif_compile_gif_template('', ''));
}

function fungif_compile_gif($image_id, $image_name){
	$image_width = 168;
	$image_src = 'https://www.funpica.com/gif/' . $image_name;
	$html = '<div id="fungif_'. $image_id .'" class="fungif_image_view" style="width: '. $image_width .'px; background-color: #f2f2f2; color: transparent"><a class="fungif-viewer-link" href="https://www.funpica.com/api/oxwall/viewer.php?picture='. $image_id .'"><img class="fungif-img" src="'. $image_src .'" style="margin-top: 0px; margin-bottom: 0px; width: '. $image_width .'px; cursor: pointer"/></a></div>';
    
    return $html;
}

function fungif_compile_gif_template($imageId, $imageSrc){

	$imageWidth = 168;
    $defImageWidthTag = '%DEFAULT_IMAGE_WIDTH%';
    $defImageIdTag = '%DEFAULT_IMAGE_ID%';
    $defImageSrcTag = '%DEFAULT_IMAGE_SRC%';
        
    $defImageWidth = $imageWidth;
    
	$templateString = '<div id="fungif-item-dispay-template"  style="display: none">
                        <div class="fungif_image_view" style="positioin: relative; margin-top: 8px; width: '. $defImageWidthTag .'px; background-color: #f2f2f2; color: transparent">
                            <a class="fungif-viewer-link" href="https://www.funpica.com/api/oxwall/viewer.php?picture='. $defImageIdTag .'">
                            	<img class="fungif-img" src="'. $defImageSrcTag .'" style="positioin: relative; margin-top: 0px; margin-bottom: 0px; width: '. $defImageWidthTag .'px; cursor: pointer"/>
                    		</a>
                    		<div class="fungif-remove-button" style="position: relative; margin-top: -30px; margin-left: 6px;"></div>
                    	</div>
                       </div>';
        
    $templateString = str_replace($defImageWidthTag, $defImageWidth, $templateString);
    $templateString = str_replace($defImageIdTag, $imageId, $templateString);
    $templateString = str_replace($defImageSrcTag, $imageSrc, $templateString);
    
    return $templateString;
        

}

function fungif_generate_script_params(){

	
	$params = array(
		'api_url_home' => 'https://www.funpica.com/',
		'panel_url' => 'https://www.funpica.com/api/oxwall/expanded_panel.php',
		'viewer_url' => 'https://www.funpica.com/api/oxwall/viewer.php',
		'src_prefix' => 'https://www.funpica.com/gif/',
		'image_width' => 168,
		'branding' => 'true',
		'site_url' => get_site_url(),
		'plugin_version' => '2.0'
	);
	
	
	$script = '<script type="text/javascript"> 
					window.FUNGIFSPARAMS = ' . json_encode($params) . '; Object.freeze(window.FUNGIFSPARAMS);
				</script>';
				
	return $script;
}


$fungif_tinymce_extension = new FungifTinyMceExtension(fungif_generate_script_params());

?>