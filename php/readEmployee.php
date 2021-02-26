<?php
	$executionStartTime = microtime(true);
	include("config.php");
	include("zfunctions.php");
	header("Content-Type: application/json; charset=UTF-8");

	$conn = new mysqli($cd_host, $cd_user, $cd_password, $cd_dbname, $cd_port, $cd_socket);

	if (mysqli_connect_errno()) {
		$output["status"]["code"] = "300";
		$output["status"]["name"] = "failure";
		$output["status"]["description"] = "database unavailable";
		$output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
		$output["data"] = [];
		mysqli_close($conn);
		echo json_encode($output);
		exit;
	}

	$filterDataID = $_POST['$filterDataID'];
	$filterDataType = $_POST['$filterDataType'];
	$where = "";
	$orderBy = "";

	if(!empty($_POST['$sortByLabel'])) {
		$lastElement = end($_POST['$sortByLabel']);
		$orderBy = " ORDER BY ";
		foreach($_POST['$sortByLabel'] as $criteria) {	
			if($criteria !== $lastElement) {
				$orderBy = $orderBy . $criteria .  ", ";
			} else {
				$orderBy = $orderBy . $criteria;
			}
		}
	} else {
		$orderBy = " ORDER BY p.lastName, p.firstName, d.name, l.name";
	}

	if($filterDataType == "Personnel" || $filterDataType == "Default") {$filterDataType = "p";}
	else if ($filterDataType == "Department") {$filterDataType = "d";}
	else if ($filterDataType == "Location") {$filterDataType = "l";}

	$filterDataID == "Default" ? $where = "" : $where = "WHERE " . $filterDataType . ".id = " . $filterDataID . " ";

	$query = "
		SELECT p.id, p.lastName, p.firstName, p.jobTitle, p.email, d.id AS departmentID, d.name AS department, l.id AS locationID, l.name AS location FROM personnel 
		p LEFT JOIN department d ON (d.id = p.departmentID) LEFT JOIN location l ON (l.id = d.locationID)" . $where . $orderBy
	;

	$stmt = $conn->prepare($query); //here
	$stmt->execute(); //here
	$result = $stmt->store_result();
	
	if (!$result) {
		$output["status"]["code"] = "400";
		$output["status"]["name"] = "executed";
		$output["status"]["description"] = "query failed";	
		$output["data"] = [];
		mysqli_close($conn);
		echo json_encode($output); 
		exit;
	}

	$data = [];
	while ($row = fetchAssocStatement($stmt)) {
		array_push($data, $row);
	}

	$output["status"]["code"] = "200";
	$output["status"]["name"] = "ok";
	$output["status"]["description"] = "success";
	$output["status"]["returnedIn"] = (microtime(true) - $executionStartTime) / 1000 . " ms";
	$output["data"] = $data;
	mysqli_close($conn);
	echo json_encode($output); 
?>