<?php

namespace Modules\Reports\Providers;

use setasign\Fpdi\TcpdfFpdi;
class PdfProvider extends TcpdfFpdi
{
  public $params = array();
	public function __construct($qr_data=array()){
			parent::__construct();
		$this->params = $qr_data;
		
	}
   
    // function Header()
    // {
    //    $this->setMargins(7, 50, 7, true);
    //    $this->SetFont('Times', 'B', 14);

    //     // Only add header content on the first page or if specific pages require it
    //     if ($this->PageNo() == 1 || $this->PageNo() > 1) {

    //     //	$this->setMargins(7, 50, 7, true);
    //        $logo = getcwd() . '/resources/images/logo.jpg';
		// 			$logo = str_replace('\\', '/', $logo);
    //     $this->Image($logo, 85, 25, 30); // Adjust position and size as necessary
    //     // Set the position for the header text
    //     $this->SetY(30); // Adjust vertical position after image

    //     // Define page width for alignment calculations
    //     $pageWidth = $this->GetPageWidth();

    //     // Left-aligned header text
    //     $this->SetX(10);
    //     $this->Cell(0, 10, 'BOMRA/', 0, 0, 'L');

    //     // Center-aligned header text
    //     $this->SetX(($pageWidth / 2) - (105)); // Adjust X position to center text (50 is approximate width of the text block)
    //     $this->Cell(0, 10, 'Botswana Medicines Regulatory Authority', 0, 0, 'C');
        
    //     // Center-aligned second line of header text
    //     $this->SetX(($pageWidth / 2) - (105)); // Adjust X position to center text
    //     $this->Cell(0, 20, 'Internal Audit Report', 0, 0, 'C');

    //     // Right-aligned header text
    //     $this->SetX($pageWidth - 90); // Adjust X position for right-aligned text (90 is approximate width of the text block)
    //     $this->Cell(0, 10, 'Issue No. ', 0, 0, 'R');
    //     }

    
    function Header()
{
    $this->setMargins(7, 50, 7, true);
    $this->SetFont('Times', 'B', 14);

    // Define page width for alignment calculations
    $pageWidth = $this->GetPageWidth();

    // Only add header content on the first page or if specific pages require it
    if ($this->PageNo() == 1 || $this->PageNo() > 1) {

        // Image positioning
        $logo = getcwd() . '/resources/images/logo.jpg';
        $logo = str_replace('\\', '/', $logo);
        $imageWidth = 30;
        $imageXPosition = ($pageWidth - $imageWidth) / 2;
        $this->Image($logo, $imageXPosition, 25, $imageWidth);

        // Set the position for the header text below the image
        $this->SetY(32.5); // 10 is the space between image and text; adjust as necessary

        // Left-aligned header text
        $this->SetX(10);
        $this->Cell(0, 10, 'BOMRA/', 0, 0, 'L');

        // Center-aligned header text
        $centerText1 = 'Botswana Medicines Regulatory Authority';
        $centerText2 = 'Internal Audit Report';
        $centerTextWidth1 = $this->GetStringWidth($centerText1);
        $centerTextWidth2 = $this->GetStringWidth($centerText2);

        // Calculate X position for centering texts
        $centerXPosition1 = ($pageWidth - $centerTextWidth1) / 2;
        $centerXPosition2 = ($pageWidth - $centerTextWidth2) / 2;

        // Set Y position for the center-aligned texts
        $headerY = $this->GetY();

        // Center-aligned first line of header text
        $this->SetXY($centerXPosition1, $headerY);
        $this->Cell($centerTextWidth1, 2, $centerText1, 0, 1, 'C');

        // Center-aligned second line of header text
        $this->SetXY($centerXPosition2, $this->GetY());
        $this->Cell($centerTextWidth2, 2, $centerText2, 0, 1, 'C');

        // Right-aligned header text
        $rightText = 'Issue No. ';
        $rightTextWidth = $this->GetStringWidth($rightText);
        $rightXPosition = $pageWidth - $rightTextWidth - 10; // 10 is the margin from the right edge

        $this->SetXY($rightXPosition, $headerY);
        $this->Cell($rightTextWidth, 10, $rightText, 0, 0, 'R');
    }
}




 public function Footer()
    {
        // Set the position at 15 mm from bottom
        $this->SetY(-15);

        // Set font for footer
        $this->SetFont('helvetica', 'I', 8);
    
   		 // Get the current date
    		$currentDate = date('d-m-Y');

   		 // Left-aligned date
   			 $this->Cell(0, 10, $currentDate, 0, 0, 'L');
   
        // Page number
        $this->Cell(0, 10, 'Page '.$this->getAliasNumPage().' of '.$this->getAliasNbPages(), 0, 0, 'R');
    }


	public function get_Docqrcode($params){
		$qr_code = new Ciqrcode($params);
		//get the details 
		
		$qr_code->generate($params); 
		
	 }
function getOrganisationInfo(){
			
						$org_info = getSingleRecord('tra_organisation_information', array('id'=>1));
			
			return $org_info;
		}
}