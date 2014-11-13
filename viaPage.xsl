<?xml version="1.0" encoding="utf-8"?>
<xsl:stylesheet version="1.0" xmlns:xsl="http://www.w3.org/1999/XSL/Transform" xmlns="http://www.w3.org/1999/xhtml" xmlns:viarecord="http://via.lib.harvard.edu" xmlns:xlink="http://www.w3.org/TR/xlink">
	<xsl:output method="html"/>


	<xsl:template  match="/">
		<html>
			<body>
				<div id="viaHeader">
					<img src="../uploaded_files/HVD/pennant_HOLLIS+beta.jpg" />
					<div>HOLLIS+ Image Detail</div>
				</div>
				<xsl:apply-templates/>
				<div id="viaFooter">
					<a href="http://nrs.harvard.edu/urn-3:hul.ois:portal_copyright">Copyright and Permissions</a>
				</div>				
			</body>
		</html>
	</xsl:template>

	<xsl:template match="work|group">

		<xsl:call-template name="iFrame"/>

		<div class="viaWorkGroupMetaData">
			<table class="VIAMetaDataTable">
				<xsl:call-template name="metaData"/>

				<tr>
					<td class="VIAMetaDataKey">
						<strong>Link to this record:</strong>
					</td>
					<td class="VIAMetaDataValue VIAMetaDataValueLinkToRecord"/>
				</tr>
			</table>
		</div>
		
		<hr class="tableSeperator"/>
				
		<!-- <br/> -->

		<xsl:for-each select="//surrogate|//subwork">
			<div class="viaComponenetMetaData">
				<table class="VIAMetaDataTable">
					<xsl:call-template name="componentId"/>
					<xsl:call-template name="metaData"/>
				</table>
			</div>
		</xsl:for-each>
		


	</xsl:template>

	<xsl:template name="componentId">

		<tr>
			<td class="VIAMetaDataKey">     
				<strong>Component ID:</strong>             
			</td>                           
			<td class="VIAMetaDataValueComponentId">   
				<xsl:value-of select="@componentID"/>
			</td>                           
		</tr>

	</xsl:template>


	<xsl:template name="metaData">
		<xsl:if test="title/textElement">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Title:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:value-of select="title/textElement"/>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="workType">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Work Type:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:value-of select="workType"/>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="creator/nameElement">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Creator:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:value-of select="creator/nameElement"/>
					<xsl:if test="creator/dates">
												, <xsl:value-of select="creator/dates"/>, 
					</xsl:if>
					<xsl:if test="creator/nationality">
												, <xsl:value-of select="creator/nationality"/>
					</xsl:if>
					<xsl:if test="creator/role">
												, <xsl:value-of select="creator/role"/>
					</xsl:if>
				</td>
			</tr>
		</xsl:if>


		<xsl:if test="freeDate">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Date:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:value-of select="freeDate"/>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="location">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Location:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:for-each select="location">
						<xsl:if test="type">
							<i>
								<xsl:value-of select="type"/>: </i>
						</xsl:if>               
						<xsl:value-of select="place"/>
						<xsl:if test="position()!=last()">
							<br/>
						</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="description">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Description:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:for-each select="description">
						<xsl:value-of select="."/>
						<xsl:if test="position()!=last()">. </xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="topic">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Topics:</strong>
				</td>
				<td class="VIAMetaDataValue">
					<xsl:for-each select="topic">
						<xsl:value-of select="term"/>
						<xsl:if test="position()!=last()">. </xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>




		<xsl:if test="production">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Production:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueProduction">
					<xsl:for-each select="production">
						<xsl:value-of select="placeOfProduction/place"/>
						<xsl:if test="producer">
							<xsl:text>,</xsl:text>
							<xsl:value-of select="producer"/>
						</xsl:if>
						<xsl:if test="role">
							<xsl:text>,</xsl:text>
							<xsl:value-of select="role"/>
						</xsl:if>
						<xsl:if test="position()!=last()">;</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="state">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>State/Edition:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueState">
					<xsl:for-each select="state">
						<xsl:value-of select="."/>
						<xsl:if test="position()!=last()">;</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="physicalDescription">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Physical Description:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValuePhysical">
					<xsl:value-of select="physicalDescription"/>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="materials">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Materials/Techniques:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueMaterialsTechniques">
					<xsl:for-each select="materials">
						<xsl:value-of select="."/>
						<xsl:if test="position()!=last()">;</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="dimensions">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Dimensions:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueDimensions">
					<xsl:for-each select="dimensions">
						<xsl:value-of select="."/>
						<xsl:if test="position()!=last()">
							<br/>
						</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="associatedName">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Associated Name:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueAssociatedName">
					<xsl:for-each select="associatedName">
						<xsl:value-of select="nameElement"/>
						<xsl:if test="dates">
							<xsl:text>, </xsl:text>
							<xsl:value-of select="dates"/>
						</xsl:if>
						<xsl:if test="nationality">
							<xsl:text>, </xsl:text>
							<xsl:value-of select="nationality"/>
						</xsl:if>
						<xsl:if test="place">
							<xsl:text>, </xsl:text>
							<xsl:value-of select="place"/>
						</xsl:if>
						<xsl:if test="role">
							<xsl:text>, </xsl:text>
							<xsl:value-of select="role"/>
						</xsl:if>
						<xsl:if test="position()!=last()">; </xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="placeName">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Location:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueLocation">
					<xsl:for-each select="placeName">
						<i>
							<xsl:text>Subject: </xsl:text>
						</i>
						<xsl:value-of select="place"/>
						<xsl:if test="position()!=last()">
							<br/>
						</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>		

		<xsl:if test="style">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Style/Period:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueStyle">
					<xsl:for-each select="style">
						<xsl:value-of select="term"/>
						<xsl:if test="position()!=last()">; </xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>				

		<xsl:if test="culture">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Nationality/Culture:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueNationalityCulture">
					<xsl:for-each select="culture">
						<xsl:value-of select="term"/>
						<xsl:if test="position()!=last()">; </xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="relatedWork">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Related Work:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueRelatedWork">
					<xsl:for-each select="relatedWork">
						<xsl:if test="relationship">
							<xsl:value-of select="relationship"/>
							<xsl:text>&#160;</xsl:text>
							<xsl:value-of select="textElement"/>
						</xsl:if>
						<xsl:if test="creator">
							<xsl:value-of select="creator"/>
							<xsl:text>.&#160;</xsl:text>
							<xsl:value-of select="production"/>
							<xsl:text>.&#160;</xsl:text>
							<xsl:value-of select="freeDate"/>
						</xsl:if>
						<xsl:if test="position()!=last()">
							<br />
						</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>
		
		<xsl:if test="relatedInformation">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Related Information:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueRelatedInformation">
					<xsl:for-each select="relatedInformation">
						<xsl:choose>
							<xsl:when test="./@xlink:href">
								<a target="_blank">
									<xsl:attribute name="href">
										<xsl:value-of select="./@xlink:href"/>
									</xsl:attribute>
									<xsl:value-of select="."/>
								</a>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="."/>
							</xsl:otherwise>
						</xsl:choose>							
						<xsl:if test="position()!=last()">
							<br />
						</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>		
		
		<xsl:if test="notes">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Note:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueNotes">
					<xsl:for-each select="notes">
						<xsl:value-of select="."/>
						<xsl:if test="position()!=last()">
							<br />
						</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>		

		<xsl:if test="classification">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Classification:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueClassification">
					<xsl:for-each select="classification">
						<xsl:if test="type">
							<xsl:value-of select="type"/>:
						</xsl:if>
						<xsl:value-of select="number"/>
						<xsl:if test="position()!=last()">
							<br/>
						</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="itemIdentifier">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Item Identifier:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueItemIdentifier">
					<xsl:for-each select="itemIdentifier">
						<xsl:value-of select="."/>
						<xsl:if test="position()!=last()">
							<br/>
						</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="copyright">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Copyright:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueCopyright">
					<xsl:for-each select="copyright">
						<xsl:choose>
							<xsl:when test="./@xlink:href">
								<a target="_blank">
									<xsl:attribute name="href">
										<xsl:value-of select="./@xlink:href"/>
									</xsl:attribute>
									<xsl:value-of select="."/>
								</a>
							</xsl:when>
							<xsl:otherwise>
								<xsl:value-of select="."/>
							</xsl:otherwise>
						</xsl:choose>
						<xsl:if test="position()!=last()">
							<br/>
						</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

		<xsl:if test="useRestrictions">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Use Restrictions:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueUseRestrictions">
					<xsl:for-each select="useRestrictions">
						<xsl:value-of select="."/>
						<xsl:if test="position()!=last()">
							<br/>
						</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

		<tr>
			<td class="VIAMetaDataKey">
				<strong>HOLLIS Number:</strong>
			</td>
			<td class="VIAMetaDataValue VIAMetaDataValueHollisNumber"/>
		</tr>

		<xsl:if test="repository">
			<tr>
				<td class="VIAMetaDataKey">
					<strong>Repository:</strong>
				</td>
				<td class="VIAMetaDataValue VIAMetaDataValueRepositoryElement">
					<xsl:for-each select="repository">
						<span class="location">
							<xsl:if test="repositoryName = 'unknown' ">
								<xsl:text>Repository </xsl:text>
							</xsl:if>
							<xsl:value-of select="repositoryName"/>
							<xsl:call-template name="ilinks" />
						</span>
						<xsl:if test="note">
							<xsl:text>.</xsl:text>
							<xsl:value-of select="note"/>
						</xsl:if>
						<xsl:for-each select="number">
							<span class="collection">								
								<!-- <br/> -->
								<xsl:value-of select="." />
							</span>	
						</xsl:for-each>
						<xsl:if test="position()!=last()">
							<br/>
						</xsl:if>
					</xsl:for-each>
				</td>
			</tr>
		</xsl:if>

	</xsl:template>

	<xsl:template name="iFrame">
		<div>
			<div class="viaIFrame">

				<iframe class="viaIFrame" frameborder="0" vspace="0" hspace="0" webkitallowfullscreen="" mozallowfullscreen="" allowfullscreen="" scrolling="auto">
					<xsl:attribute name="src">
						<xsl:value-of select="concat(//image/@xlink:href, '?buttons=Y')" />
					</xsl:attribute>

				</iframe>
			</div>
		</div>
	</xsl:template>

	<xsl:template name="ilinks">

		<xsl:choose>	 
			<xsl:when test="./repositoryName = 'Arnold Arboretum/Horticulture Library (Jamaica Plain)'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Arboretum.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>							  

			<xsl:when test="./repositoryName = 'Baker Library, Harvard Business School, Historical Collections'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Baker.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Biblioteca Berenson, Fototeca, Villa I Tatti - The Harvard University Center for Italian Renaissance Studies'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Itatti.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Gray Herbarium Library'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Botany.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Cabot Science Library'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Cabot.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Center for Hellenic Studies'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Hellenic.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Francis A. Countway Library of Medicine'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Countway.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Image Collections and Fieldwork Archives, Dumbarton Oaks Research Library and Collection'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-DoaksICFA.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Ernst Mayr Library of the Museum of Comparative Zoology'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-MCZ.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'General Artemas Ward House Museum'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Ward.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard Art Museum'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-HUAM.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard University Art Museums'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-HUAM.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard College Observatory Library'">
				<a target="_new">
					<xsl:attribute name="href">http://tdc-www.harvard.edu/plates/</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard Divinity School'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Divinity.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard Film Archive'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Film.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard Fine Arts Library, Visual Collections - Slides and Digital Images'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-FAL-SDI.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard Fine Arts Library, Visual Collections - Historical Photographs'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-FAL-HPSVC.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard Fine Arts Library, Special Collections'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-FAL-HPSVC.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard Forest'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Forest.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard Law School Library'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Law.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard Portrait/Clock Collections'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-HUPC.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard Theatre Collection'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Theatre.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard University Archives'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/huarc/</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Harvard-Yenching Library'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Yenching.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Houghton Library, Department of Printing and Graphic Arts'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-HoughtonPGA.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Houghton Library, Manuscript Department'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-HoughtonMBMSS.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Houghton Library'">
				<a target="_new">
					<xsl:attribute name="href">http://hcl.harvard.edu/libraries/houghton/</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Judaica Division, Widener Library'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Judaica.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Loeb Library, Harvard Design School'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Leob.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Milman Parry Collection of Oral Literature'">
				<a target="_new">
					<xsl:attribute name="href">http://chs119.harvard.edu/mpc/</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Peabody Museum of Archaeology and Ethnology, Photographic Archives'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Peabody.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Radcliffe Archives'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-RadcliffeARCH.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Schlesinger Library on the History of Women in America, Radcliffe Institute'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-Schlesinger.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Theodore Roosevelt Collection'">
				<a target="_new">
					<xsl:attribute name="href">http://hul.harvard.edu/cmtes/ulc/aac/via/desc-TR.html</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Tozzer Library'">
				<a target="_new">
					<xsl:attribute name="href">http://hcl.harvard.edu/libraries/tozzer/</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when>

			<xsl:when test="./repositoryName = 'Widener Library'">
				<a target="_new">
					<xsl:attribute name="href">http://hcl.harvard.edu/libraries/widener/</xsl:attribute>
					<img class="extimg" >
						<xsl:attribute name="src">libInfoPage.png</xsl:attribute>
					</img>
				</a>
			</xsl:when> 
			<xsl:otherwise>
			</xsl:otherwise>
		</xsl:choose>


	</xsl:template>

	<xsl:template name="TEMP">




		<div class="VIAMetaData">
			<table class="VIAMetaDataTable">


				<xsl:if test="parent::surrogate or parent::subwork">
					<tr>
						<td class="VIAMetaDataKey">     
							<strong>Component:</strong>             
						</td>                           
						<td class="VIAMetaDataValue">   
							<xsl:value-of select="../@componentID"/>
						</td>                           
					</tr>
				</xsl:if>
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

				<xsl:if test="../topic">            
					<tr>                                    
						<td class="VIAMetaDataKey">                 
							<strong>Topic:</strong>                          
						</td>                                       
						<td class="VIAMetaDataValue">               
							<xsl:for-each select="../topic">
								<xsl:value-of select="term"/>
								<xsl:if test="position()!=last()">;&#160;</xsl:if>
							</xsl:for-each>
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

				<xsl:if test="../repository/repositoryName">
					<tr>
						<td class="VIAMetaDataKey">
							<strong>Repository:</strong>
						</td>
						<td class="VIAMetaDataValue">
							<xsl:value-of select="../repository/repositoryName"/>
						</td>
					</tr>
				</xsl:if>




			</table>

		</div>

	</xsl:template>


</xsl:stylesheet>




