<?php

//ini_set('display_errors', 'On');
//error_reporting(E_ALL);

$executionStartTime = microtime(true);

include("config.php");

header('Content-Type: application/json; charset=UTF-8');

$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

if (mysqli_connect_errno()) {
		
	$output['status']['code'] = "300";
	$output['status']['name'] = "failure";
	$output['status']['description'] = "database unavailable";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output);

	exit;

}	
/* 
Get the letter user clicked on and assign it a variable  
Always sanitize user's submited input !!!!!!! 
*/
$sort = isset($_GET['firstLetter']) ? filter_input(INPUT_GET, 'firstLetter',FILTER_SANITIZE_URL) : "" ; 
if($sort == "") {
$query = "SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) ORDER BY p.lastName ASC " ;
    }else{

$query = "SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.name as department, l.name as location FROM personnel p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID) WHERE p.lastName LIKE '$sort%' ORDER BY p.lastName ASC" ;
    }
$result = $conn->query("$query");

for ($i = 65; $i < 91; $i++) {
    printf('<a href="%s?firstLetter=%s">%s</a> | ', $_SERVER['localhost:8888'] , chr($i), chr($i));
    }
    printf('<a href="%s">ALL</a> | ', $_SERVER['localhost:8888'] );
    echo "<br>" ;
 
$rowcount = $result->num_rows ;
echo "<b style='color:red'>Results found --> $rowcount</b>" ;
 
if (!$result) {

	$output['status']['code'] = "400";
	$output['status']['name'] = "executed";
	$output['status']['description'] = "query failed";	
	$output['data'] = [];

	mysqli_close($conn);

	echo json_encode($output); 

	exit;

}
$data = [];

	while ($row = mysqli_fetch_assoc($result)) {

		array_push($data, $row);

	}
         
    
    
	$output['status']['code'] = "200";
	$output['status']['name'] = "ok";
	$output['status']['description'] = "success";
	$output['status']['returnedIn'] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output['data'] = $data;
	
	mysqli_close($conn);

	echo json_encode($output); 

 
 
?>
	