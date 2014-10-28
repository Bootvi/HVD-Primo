<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" xmlns:viarecord="http://via.lib.harvard.edu" xmlns:xlink="http://www.w3.org/TR/xlink">
	<xsl:output method="html"/>


	<xsl:template name="VIAGallary" match="/">
		<xsl:for-each select="//image">
			<html>
				<body>
					<div class="VIAThumbnail">
						<table>

							<!-- Thumbnail image starts here -->
							<tr class="VIAThumbnailImage">
								<td>
									<a class="fancybox fancybox.iframe">
										<xsl:attribute name="href">
											<xsl:value-of select="concat(@xlink:href, '?buttons=Y')" />
										</xsl:attribute>

										<xsl:attribute name="title">
											<xsl:if test="parent::surrogate | parent::subwork">
												<xsl:value-of select="../title/textElement"/>
											</xsl:if>
											<xsl:if test="not(parent::surrogate | parent::subwork)">
												<xsl:value-of select="caption"/>
											</xsl:if>
										</xsl:attribute>
										<div class="VIAThumbnailImageWrapper">
											<img>
												<xsl:attribute name="src">
													<xsl:value-of select="concat(thumbnail/@xlink:href, '?height=150&amp;width=150')" />
												</xsl:attribute>
											</img>
											<xsl:if test="@restrictedImage='true'">
												<img src="../uploaded_files/HVD/lock.png" class="VIARestrictedThumbnail"/>
											</xsl:if>  
										</div>
									</a>
								</td>
							</tr>

							<!-- Caption here -->
							<tr class="VIAThumbnailCaption">
								<td>
									<span class="VIAThumbnailTitle">
										<xsl:if test="parent::surrogate | parent::subwork">
											<xsl:value-of select="../title/textElement"/>
										</xsl:if>
										<xsl:if test="not(parent::surrogate | parent::subwork)">
											<xsl:value-of select="caption"/>
										</xsl:if>
									</span>
								</td>
							</tr>
						</table>



						<xsl:if test="parent::surrogate | parent::subwork">
							<div class="VIAMetaData">
								<table class="VIAMetaDataTable">
									<tr>
										<td class="VIAMetaDataKey">     
											<strong>Component:</strong>             
										</td>                           
										<td class="VIAMetaDataValue">   
											<xsl:value-of select="../@componentID"/>
										</td>                           
									</tr>
									<xsl:if test="../title/textElement">
										<tr>
											<td class="VIAMetaDataKey">
												<strong>Title:</strong>
											</td>
											<td class="VIAMetaDataValue">
												<xsl:value-of select="../title/textElement"/>
											</td>
										</tr>
									</xsl:if>
									<xsl:if test="../creator/nameElement">
										<tr>
											<td class="VIAMetaDataKey">
												<strong>Creator:</strong>
											</td>
											<td class="VIAMetaDataValue">
												<xsl:value-of select="../creator/nameElement"/>
												<xsl:if test="../creator/dates">
												, <xsl:value-of select="../creator/dates"/>, 
												</xsl:if>
												<xsl:if test="../creator/nationality">
												, <xsl:value-of select="../creator/nationality"/>
												</xsl:if>
												<xsl:if test="../creator/role">
												, <xsl:value-of select="../creator/role"/>
												</xsl:if>
											</td>
										</tr>
									</xsl:if>
									<xsl:if test="../workType">
										<tr>
											<td class="VIAMetaDataKey">
												<strong>Worktype:</strong>
											</td>
											<td class="VIAMetaDataValue">
												<xsl:value-of select="../workType"/>
											</td>
										</tr>
									</xsl:if>
									<xsl:if test="../freeDate">
										<tr>
											<td class="VIAMetaDataKey">
												<strong>Date:</strong> 
											</td>
											<td class="VIAMetaDataValue">
												<xsl:value-of select="../freeDate"/>
											</td>
										</tr>
									</xsl:if>
									<xsl:if test="../notes">
										<tr>
											<td class="VIAMetaDataKey">
												<strong>Note:</strong> 
											</td>
											<td class="VIAMetaDataValue">
												<xsl:value-of select="../notes"/>
											</td>
										</tr>
									</xsl:if>
									<xsl:if test="../classification/number">
										<tr>
											<td class="VIAMetaDataKey">
												<strong>Classification:</strong> 
											</td>
											<td class="VIAMetaDataValue">
												<xsl:value-of select="../classification/number"/>
											</td>
										</tr>
									</xsl:if>

								</table>

							</div>
						</xsl:if>
					</div>
				</body>
			</html>
		</xsl:for-each>
	</xsl:template>
</xsl:stylesheet>



